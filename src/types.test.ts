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
  VoteTally,
  isTopicType,
  isVoteTallyType,
  isCommentType,
  isCategorizedCommentType,
} from "./types";

describe("Types Test", () => {
  it("The total votes should be the sum of all the different VoteTally values", () => {
    expect(new VoteTally(1, 2, 3).totalCount).toEqual(6);
    expect(new VoteTally(1, 2).totalCount).toEqual(3);
  });

  it("Valid VoteTallies should pass isVoteTallyType", () => {
    expect(isVoteTallyType({ agreeCount: 2, disagreeCount: 12 })).toBeTruthy();
    expect(isVoteTallyType({ agreeCount: 2, disagreeCount: 12, passCount: 0 })).toBeTruthy();
  });

  it("Invalid VoteTallies should fail isVoteTallyType", () => {
    expect(isVoteTallyType({})).toBeFalsy();
    expect(isVoteTallyType({ agreeCount: "2" })).toBeFalsy();
  });

  it("Valid Comment should pass isCommentType", () => {
    expect(isCommentType({ id: "2", text: "hello" })).toBeTruthy();
    expect(
      isCommentType({
        id: "2",
        text: "hello",
        voteTalliesByGroup: { "group 1": { agreeCount: 1, disagreeCount: 2 } },
      })
    ).toBeTruthy();
  });

  it("Invalid Comment should fail isCommentType", () => {
    expect(isCommentType({})).toBeFalsy();
    // Vote Tally counts must be of type number
    expect(
      isCommentType({
        id: "2",
        text: "hello",
        voteTalliesByGroup: { "group 1": { agreeCount: "1", disagreeCount: "2" } },
      })
    ).toBeFalsy();
  });

  it("Valid CategorizedComment should pass isCategorizedCommentType", () => {
    expect(isCategorizedCommentType({ id: "123", topics: [] })).toBeTruthy();
    expect(
      isCategorizedCommentType({
        id: "123",
        text: "hello",
        topics: [],
        voteTalliesByGroup: { "group 1": { agreeCount: 1, disagreeCount: 2 } },
      })
    ).toBeTruthy();
  });

  it("Invalid CategorizedComment should fail isCategorizedCommentType", () => {
    // ID is required.
    expect(isCategorizedCommentType({ topics: [{ name: "Healthcare" }] })).toBeFalsy();
    // ID must be of type string.
    expect(isCategorizedCommentType({ id: 1, topics: [{ name: "Healthcare" }] })).toBeFalsy();
    // Topics must be valid, the second one is missing a name.
    expect(
      isCategorizedCommentType({
        id: 1,
        topics: [{ name: "Healthcare" }, { subtopics: { name: "Public Parks" } }],
      })
    ).toBeFalsy();
  });

  it("Valid Topics should pass isTopicType", () => {
    expect(isTopicType({ name: "Test Topic" })).toBeTruthy();
    expect(
      isTopicType({ name: "Test Topic", subtopics: [{ name: "Test Subtopic" }] })
    ).toBeTruthy();
  });

  it("Invalid Topics should not pass isTopicType", () => {
    expect(isTopicType({})).toBeFalsy();
    expect(isTopicType({ name: 2 })).toBeFalsy();
    expect(isTopicType({ name: 2, subtopics: [{}] })).toBeFalsy();
    // The object has one valid subtopic and one invalid subtopic.
    expect(
      isTopicType({ name: "Test Topic", subtopics: [{ name: "Test Subtopic" }, {}] })
    ).toBeFalsy();
  });
});
