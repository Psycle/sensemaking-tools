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
  generateTopicModelingPrompt,
  LEARN_TOPICS_PROMPT,
  LEARN_TOPICS_AND_SUBTOPICS_PROMPT,
  learnSubtopicsPrompt
} from './topic_modeling';

describe('Topic Modeling Prompt Generator', () => {
  it('should generate a prompt for learning top-level topics only (depth 1, no subtopics)', () => {
    const includeSubtopics = false;
    const prompt = generateTopicModelingPrompt(includeSubtopics);
    expect(prompt).toEqual(LEARN_TOPICS_PROMPT);
  });

  it('should generate a prompt for learning subtopics with given top-level topics (depth 2)', () => {
    const includeSubtopics = true;
    const parentTopics = ['Economic Development', 'Housing', 'Infrastructure'];
    const expectedPrompt = learnSubtopicsPrompt(parentTopics);

    const prompt = generateTopicModelingPrompt(includeSubtopics, parentTopics);
    expect(prompt).toEqual(expectedPrompt);
  });

  it('should generate a prompt for learning topics and subtopics (depth 2, no given top-level topics)', () => {
    const includeSubtopics = true;
    const prompt = generateTopicModelingPrompt(includeSubtopics);
    expect(prompt).toEqual(LEARN_TOPICS_AND_SUBTOPICS_PROMPT);
  });
});