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
  addMissingTextToCategorizedComments,
  findMissingComments,
  generateCategorizationPrompt,
  groupCommentsByTopic,
  validateCategorizedComments,
} from "./categorization";
import { Comment, Topic } from "../types";

describe("generateCategorizationPrompt", () => {
  it("should generate a 1-level categorization prompt (topics only)", () => {
    const sampleTopics: Topic[] = [{ name: "Economic Development" }, { name: "Housing" }];
    const includeSubtopics = false;
    const prompt = generateCategorizationPrompt(sampleTopics, includeSubtopics);
    expect(prompt).toContain(
      "For each of the following comments, identify the most relevant topic from the list below."
    );
    expect(prompt).toContain("Economic Development");
  });

  it("should generate a 2-level categorization prompt (topics and subtopics)", () => {
    const sampleTopics: Topic[] = [
      {
        name: "Economic Development",
        subtopics: [{ name: "Job Creation" }, { name: "Business Growth" }],
      },
      {
        name: "Housing",
        subtopics: [{ name: "Affordable Housing Options" }, { name: "Rental Market Prices" }],
      },
    ];
    const includeSubtopics = true;
    const prompt = generateCategorizationPrompt(sampleTopics, includeSubtopics);
    expect(prompt).toContain(
      "For each of the following comments, identify the most relevant topic and subtopic from the list below."
    );
    expect(prompt).toContain("Economic Development");
    expect(prompt).toContain("Job Creation");
  });
});

describe("addMissingTextToCategorizedComments", () => {
  it("should add missing text to categorized comments", () => {
    const inputCommentsLookup = new Map<string, Comment>([
      ["1", { id: "1", text: "This is comment 1", topics: [] }],
      ["2", { id: "2", text: "This is comment 2", topics: [] }],
    ]);
    const categorizedComments = [
      { id: "1", topics: [{ name: "Topic 1", subtopics: [] }] },
      { id: "2", topics: [{ name: "Topic 2", subtopics: [] }] },
    ];

    const result = addMissingTextToCategorizedComments(categorizedComments, inputCommentsLookup);

    expect(result).toEqual([
      {
        id: "1",
        text: "This is comment 1",
        topics: [{ name: "Topic 1", subtopics: [] }],
      },
      {
        id: "2",
        text: "This is comment 2",
        topics: [{ name: "Topic 2", subtopics: [] }],
      },
    ]);
  });

  it("should handle missing comments in the lookup map", () => {
    const inputCommentsLookup = new Map<string, Comment>([
      ["1", { id: "1", text: "This is comment 1", topics: [] }],
      // Comment with ID '2' is missing from the lookup map
    ]);
    const categorizedComments = [
      { id: "1", topics: [{ name: "Topic 1", subtopics: [] }] },
      { id: "2", topics: [{ name: "Topic 2", subtopics: [] }] },
    ];

    const result = addMissingTextToCategorizedComments(categorizedComments, inputCommentsLookup);

    expect(result).toEqual([
      {
        id: "1",
        text: "This is comment 1",
        topics: [{ name: "Topic 1", subtopics: [] }],
      },
      { id: "2", topics: [{ name: "Topic 2", subtopics: [] }] }, // 'text' property should not be added
    ]);
  });
});

describe("validateCategorizedComments", () => {
  const inputComments: Comment[] = [
    { id: "1", text: "Comment 1", topics: [] },
    { id: "2", text: "Comment 2", topics: [] },
  ];

  const topics: Topic[] = [
    { name: "Topic 1", subtopics: [{ name: "Subtopic 1" }] },
    { name: "Topic 2", subtopics: [{ name: "Subtopic 2" }] },
  ];

  it("should return all comments as valid with correct input", () => {
    const categorizedComments: Comment[] = [
      {
        id: "1",
        text: "Comment 1",
        topics: [{ name: "Topic 1", subtopics: [{ name: "Subtopic 1" }] }],
      },
      {
        id: "2",
        text: "Comment 2",
        topics: [{ name: "Topic 2", subtopics: [{ name: "Subtopic 2" }] }],
      },
    ];
    const { commentsPassedValidation, commentsWithInvalidTopics } = validateCategorizedComments(
      categorizedComments,
      inputComments,
      true,
      topics
    );
    expect(commentsPassedValidation.length).toBe(2);
    expect(commentsWithInvalidTopics.length).toBe(0);
  });

  it("should filter out extra comments", () => {
    const categorizedComments: Comment[] = [
      {
        id: "1",
        text: "Comment 1",
        topics: [{ name: "Topic 1", subtopics: [{ name: "Subtopic 1" }] }],
      },
      {
        id: "2",
        text: "Comment 2",
        topics: [{ name: "Topic 2", subtopics: [{ name: "Subtopic 2" }] }],
      },
      {
        id: "3",
        text: "Extra comment",
        topics: [{ name: "Topic 1", subtopics: [{ name: "Subtopic 1" }] }],
      },
    ];
    const { commentsPassedValidation, commentsWithInvalidTopics } = validateCategorizedComments(
      categorizedComments,
      inputComments,
      true,
      topics
    );
    expect(commentsPassedValidation.length).toBe(2);
    expect(commentsWithInvalidTopics.length).toBe(0);
  });

  it("should filter out comments with empty topics", () => {
    const categorizedComments: Comment[] = [
      {
        id: "1",
        text: "Comment 1",
        topics: [{ name: "Topic 1", subtopics: [{ name: "Subtopic 1" }] }],
      },
      { id: "2", text: "Comment 2", topics: [] },
    ];
    const { commentsPassedValidation, commentsWithInvalidTopics } = validateCategorizedComments(
      categorizedComments,
      inputComments,
      true,
      topics
    );
    expect(commentsPassedValidation.length).toBe(1);
    expect(commentsWithInvalidTopics.length).toBe(1);
  });

  it("should filter out comments with empty subtopics", () => {
    const categorizedComments: Comment[] = [
      {
        id: "1",
        text: "Comment 1",
        topics: [{ name: "Topic 1", subtopics: [{ name: "Subtopic 1" }] }],
      },
      {
        id: "2",
        text: "Comment 2",
        topics: [{ name: "Topic 2", subtopics: [] }],
      },
    ];
    const { commentsPassedValidation, commentsWithInvalidTopics } = validateCategorizedComments(
      categorizedComments,
      inputComments,
      true,
      topics
    );
    expect(commentsPassedValidation.length).toBe(1);
    expect(commentsWithInvalidTopics.length).toBe(1);
  });

  it("should filter out comments with invalid topic names", () => {
    const categorizedComments: Comment[] = [
      {
        id: "1",
        text: "Comment 1",
        topics: [{ name: "Topic 1", subtopics: [{ name: "Subtopic 1" }] }],
      },
      {
        id: "2",
        text: "Comment 2",
        topics: [{ name: "Invalid Topic", subtopics: [{ name: "Subtopic 2" }] }],
      },
    ];
    const { commentsPassedValidation, commentsWithInvalidTopics } = validateCategorizedComments(
      categorizedComments,
      inputComments,
      true,
      topics
    );
    expect(commentsPassedValidation.length).toBe(1);
    expect(commentsWithInvalidTopics.length).toBe(1);
  });

  it("should filter out a comment with one valid and one invalid topic name", () => {
    const categorizedComments: Comment[] = [
      {
        id: "1",
        text: "Comment 1",
        topics: [
          { name: "Topic 1", subtopics: [{ name: "Subtopic 1" }] },
          { name: "Invalid Topic", subtopics: [{ name: "Subtopic 2" }] },
        ],
      },
      {
        id: "2",
        text: "Comment 2",
        topics: [{ name: "Topic 2", subtopics: [{ name: "Subtopic 2" }] }],
      },
    ];
    const { commentsPassedValidation, commentsWithInvalidTopics } = validateCategorizedComments(
      categorizedComments,
      inputComments,
      true,
      topics
    );
    expect(commentsPassedValidation.length).toBe(1); // Only Comment 2 should pass
    expect(commentsWithInvalidTopics.length).toBe(1); // Comment 1 should fail
  });

  it("should filter out comments with invalid subtopic names", () => {
    const categorizedComments: Comment[] = [
      {
        id: "1",
        text: "Comment 1",
        topics: [{ name: "Topic 1", subtopics: [{ name: "Subtopic 1" }] }],
      },
      {
        id: "2",
        text: "Comment 2",
        topics: [{ name: "Topic 2", subtopics: [{ name: "Invalid Subtopic" }] }],
      },
    ];
    const { commentsPassedValidation, commentsWithInvalidTopics } = validateCategorizedComments(
      categorizedComments,
      inputComments,
      true,
      topics
    );
    expect(commentsPassedValidation.length).toBe(1);
    expect(commentsWithInvalidTopics.length).toBe(1);
  });

  it("should filter out a comment with one valid and one invalid subtopic name", () => {
    const categorizedComments: Comment[] = [
      {
        id: "1",
        text: "Comment 1",
        topics: [
          {
            name: "Topic 1",
            subtopics: [{ name: "Subtopic 1" }, { name: "Invalid Subtopic" }],
          },
        ],
      },
      {
        id: "2",
        text: "Comment 2",
        topics: [{ name: "Topic 2", subtopics: [{ name: "Subtopic 2" }] }],
      },
    ];
    const { commentsPassedValidation, commentsWithInvalidTopics } = validateCategorizedComments(
      categorizedComments,
      inputComments,
      true,
      topics
    );
    expect(commentsPassedValidation.length).toBe(1); // Only Comment 2 should pass
    expect(commentsWithInvalidTopics.length).toBe(1); // Comment 1 should fail
  });

  it('should allow "Other" as a valid topic or subtopic name', () => {
    const categorizedComments: Comment[] = [
      {
        id: "1",
        text: "Comment 1",
        topics: [{ name: "Other", subtopics: [{ name: "Other Subtopic 1" }] }],
      },
      {
        id: "2",
        text: "Comment 2",
        topics: [{ name: "Topic 2", subtopics: [{ name: "Other" }] }],
      },
    ];
    const { commentsPassedValidation, commentsWithInvalidTopics } = validateCategorizedComments(
      categorizedComments,
      inputComments,
      true,
      topics
    );
    expect(commentsPassedValidation.length).toBe(2);
    expect(commentsWithInvalidTopics.length).toBe(0);
  });
});

describe("findMissingComments", () => {
  it("should return an empty array when all comments are present", () => {
    const categorizedComments: Comment[] = [
      { id: "1", text: "Comment 1", topics: [] },
      { id: "2", text: "Comment 2", topics: [] },
    ];
    const inputComments: Comment[] = [
      { id: "1", text: "Comment 1", topics: [] },
      { id: "2", text: "Comment 2", topics: [] },
    ];
    const missingComments = findMissingComments(categorizedComments, inputComments);
    expect(missingComments).toEqual([]);
  });

  it("should return missing comments when some are not present", () => {
    const categorizedComments: Comment[] = [{ id: "1", text: "Comment 1", topics: [] }];
    const inputComments: Comment[] = [
      { id: "1", text: "Comment 1", topics: [] },
      { id: "2", text: "Comment 2", topics: [] },
      { id: "3", text: "Comment 3", topics: [] },
    ];
    const missingComments = findMissingComments(categorizedComments, inputComments);
    expect(missingComments).toEqual([
      { id: "2", text: "Comment 2", topics: [] },
      { id: "3", text: "Comment 3", topics: [] },
    ]);
  });

  it("should return all comments when none are present", () => {
    const categorizedComments: Comment[] = [];
    const inputComments: Comment[] = [
      { id: "1", text: "Comment 1", topics: [] },
      { id: "2", text: "Comment 2", topics: [] },
    ];
    const missingComments = findMissingComments(categorizedComments, inputComments);
    expect(missingComments).toEqual([
      { id: "1", text: "Comment 1", topics: [] },
      { id: "2", text: "Comment 2", topics: [] },
    ]);
  });
});

describe("groupCommentsByTopic", () => {
  it("should group comments by topic and subtopic", () => {
    const categorizedComments: Comment[] = [
      {
        id: "1",
        text: "Comment 1",
        topics: [
          { name: "Topic 1", subtopics: [{ name: "Subtopic 1.1" }] },
          { name: "Topic 2", subtopics: [{ name: "Subtopic 2.1" }] },
        ],
      },
      {
        id: "2",
        text: "Comment 2",
        topics: [
          { name: "Topic 1", subtopics: [{ name: "Subtopic 1.1" }] },
          { name: "Topic 1", subtopics: [{ name: "Subtopic 1.2" }] },
        ],
      },
    ];

    const expectedOutput = {
      "Topic 1": {
        "Subtopic 1.1": {
          "1": "Comment 1",
          "2": "Comment 2",
        },
        "Subtopic 1.2": {
          "2": "Comment 2",
        },
      },
      "Topic 2": {
        "Subtopic 2.1": {
          "1": "Comment 1",
        },
      },
    };

    const result = groupCommentsByTopic(categorizedComments);
    expect(JSON.parse(result)).toEqual(expectedOutput);
  });

  it("should throw an error if a comment has no topics", () => {
    const categorizedComments: Comment[] = [
      {
        id: "1",
        text: "Comment 1",
        topics: [], // No topics assigned
      },
    ];

    expect(() => groupCommentsByTopic(categorizedComments)).toThrow(
      "Comment with ID 1 has no topics assigned."
    );
  });
});
