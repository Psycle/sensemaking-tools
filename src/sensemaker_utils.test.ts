// Copyright 2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {
  getPrompt,
  groupCommentsBySubtopic,
  formatCommentsWithVotes,
  decimalToPercent,
  executeInParallel,
  getUniqueTopics,
} from "./sensemaker_utils";
import { Comment } from "./types";
import pLimit from "p-limit";
import { MAX_RETRIES } from "./models/model_util";

// mock retry timeout
jest.mock("./models/model_util", () => {
  const originalModule = jest.requireActual("./models/model_util");
  return {
    __esModule: true,
    ...originalModule,
    RETRY_DELAY_MS: 0,
  };
});

const TEST_COMMENTS = [
  {
    id: "1",
    text: "comment1",
    voteTalliesByGroup: {
      "0": {
        agreeCount: 10,
        disagreeCount: 5,
        passCount: 0,
        totalCount: 15,
      },
      "1": {
        agreeCount: 5,
        disagreeCount: 10,
        passCount: 5,
        totalCount: 20,
      },
    },
  },
  {
    id: "2",
    text: "comment2",
    voteTalliesByGroup: {
      "0": {
        agreeCount: 2,
        disagreeCount: 5,
        passCount: 3,
        totalCount: 10,
      },
      "1": {
        agreeCount: 5,
        disagreeCount: 3,
        passCount: 2,
        totalCount: 10,
      },
    },
  },
];

describe("SensemakerUtilsTest", () => {
  it("should create a prompt", () => {
    expect(getPrompt("Summarize this.", ["comment1", "comment2"])).toEqual(
      `
<instructions>
  Summarize this.
</instructions>

<data>
  <comment>comment1</comment>
  <comment>comment2</comment>
</data>`
    );
  });

  it("should include additional instructions in the prompt", () => {
    expect(
      getPrompt(
        "Summarize this.",
        ["comment1", "comment2"],
        "This is for a town hall style conversation"
      )
    ).toEqual(`
<instructions>
  Summarize this.
</instructions>

<additionalContext>
  This is for a town hall style conversation
</additionalContext>

<data>
  <comment>comment1</comment>
  <comment>comment2</comment>
</data>`);
  });
  describe("groupCommentsByTopic", () => {
    it("should group comments by topic and subtopic", () => {
      const comment1: Comment = {
        id: "1",
        text: "Comment 1",
        topics: [
          { name: "Topic 1", subtopics: [{ name: "Subtopic 1.1" }] },
          { name: "Topic 2", subtopics: [{ name: "Subtopic 2.1" }] },
        ],
      };
      const comment2: Comment = {
        id: "2",
        text: "Comment 2",
        topics: [
          { name: "Topic 1", subtopics: [{ name: "Subtopic 1.1" }] },
          { name: "Topic 1", subtopics: [{ name: "Subtopic 1.2" }] },
        ],
      };

      const categorizedComments: Comment[] = [comment1, comment2];

      const expectedOutput = {
        "Topic 1": {
          "Subtopic 1.1": {
            "1": comment1,
            "2": comment2,
          },
          "Subtopic 1.2": {
            "2": comment2,
          },
        },
        "Topic 2": {
          "Subtopic 2.1": {
            "1": comment1,
          },
        },
      };

      const result = groupCommentsBySubtopic(categorizedComments);
      expect(result).toEqual(expectedOutput);
    });

    it("should skip comment if it has no topics", () => {
      const categorizedComments: Comment[] = [
        {
          id: "1",
          text: "Comment 1",
          topics: [], // No topics assigned
        },
      ];

      expect(groupCommentsBySubtopic(categorizedComments)).toEqual({});
    });
  });
  it("should format comments with vote tallies via formatCommentsWithVotes", () => {
    expect(formatCommentsWithVotes(TEST_COMMENTS)).toEqual([
      `comment1
      vote info per group: {"0":{"agreeCount":10,"disagreeCount":5,"passCount":0,"totalCount":15},"1":{"agreeCount":5,"disagreeCount":10,"passCount":5,"totalCount":20}}`,
      `comment2
      vote info per group: {"0":{"agreeCount":2,"disagreeCount":5,"passCount":3,"totalCount":10},"1":{"agreeCount":5,"disagreeCount":3,"passCount":2,"totalCount":10}}`,
    ]);
  });

  it("Should get unique topics from a list of comments", () => {
    expect(
      getUniqueTopics([
        { id: "1", text: "hi", topics: [{ name: "topic1", subtopics: [{ name: "subtopic1" }] }] },
        {
          id: "2",
          text: "hello",
          topics: [{ name: "topic1", subtopics: [{ name: "subtopic1" }, { name: "subtopic2" }] }],
        },
        {
          id: "3",
          text: "hola",
          topics: [{ name: "topic2", subtopics: [{ name: "subtopic3" }] }],
        },
      ])
    ).toEqual([
      { name: "topic1", subtopics: [{ name: "subtopic1" }, { name: "subtopic2" }] },
      { name: "topic2", subtopics: [{ name: "subtopic3" }] },
    ]);
  });

  describe("decimalToPercent", () => {
    it("should convert decimal to percent", () => expect(decimalToPercent(0.5)).toEqual("50%"));
    it("should convert decimal to percent with precision", () =>
      expect(decimalToPercent(0.55555, 2)).toEqual("55.56%"));
  });
});

jest.mock("p-limit"); // Mock pLimit to control its behavior
const mockedPLimit = pLimit as jest.MockedFunction<typeof pLimit>;

describe("executeInParallel", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Reset the mock before each test
    mockedPLimit.mockReset();
    // By default, make the pLimit instance return a mock function that simply executes the wrapped function
    const limitInstance = jest.fn((fn: () => Promise<never>) => fn());
    mockedPLimit.mockReturnValue(limitInstance as never);
    // Suppress console.error
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should execute all callbacks and return their results in order", async () => {
    const callbacks = [
      () => Promise.resolve(1),
      () => Promise.resolve(2),
      () => Promise.resolve(3),
    ];
    const results = await executeInParallel(callbacks, 2);
    expect(results).toEqual([1, 2, 3]);
  });

  it("should handle a mix of fast and slow promises with concurrency", async () => {
    const callbacks = [
      () => Promise.resolve(1),
      () => new Promise((resolve) => setTimeout(() => resolve(2), 200)),
      () => Promise.resolve(3),
      () => new Promise((resolve) => setTimeout(() => resolve(4), 100)),
      () => Promise.resolve(5),
    ];
    const results = await executeInParallel(callbacks, 2);
    expect(results).toEqual([1, 2, 3, 4, 5]);
  });

  it("should retry failed callbacks up to MAX_RETRIES times", async () => {
    let retryCount1 = 0;
    const callbacks = [
      () =>
        new Promise((_, reject) => {
          retryCount1++;
          reject(new Error("Retry 1 Failed"));
        }),
    ];

    const limitInstance = jest.fn((fn: () => Promise<never>) => {
      return new Promise((resolve, reject) => {
        const result = fn();
        result.then(resolve, reject); // Ensure errors are propagated
      });
    });
    mockedPLimit.mockReturnValue(limitInstance as never);

    await expect(executeInParallel(callbacks, 1)).rejects.toThrow("Retry 1 Failed");
    expect(retryCount1).toBe(MAX_RETRIES);
  });

  it("should resolve if a retried callback eventually succeeds", async () => {
    let retryCount = 0;
    const callbacks = [
      () =>
        new Promise((resolve, reject) => {
          if (retryCount < 2) {
            retryCount++;
            reject(new Error("Temporary failure"));
          } else {
            resolve("Success after retries");
          }
        }),
    ];

    const results = await executeInParallel(callbacks, 1);
    expect(results).toEqual(["Success after retries"]);
    expect(retryCount).toBe(2);
  });
});
