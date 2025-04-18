// Copyright 2025 Google LLC
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

// Module for automated evaluation of hallucination using LLMs.

import {
  AutoratingAggregatedResults,
  generateEvaluationReport,
  StatementWithComments,
} from "./autorating_utils";
import fs from "fs";
import { VertexModel } from "../../src/models/vertex_model";
import * as path from "node:path";
import { Static, Type } from "@sinclair/typebox";

// Define the JSON schema for the LLM response
const ResponseSchema = Type.Object({
  analysis: Type.String(),
  answer: Type.String(),
  explanation: Type.String(),
});
type ResponseType = Static<typeof ResponseSchema>;

/**
 * Evaluates the hallucination/fabrication tendency of generated summary statements by comparing
 * them to the original comments.
 *
 * This function takes a set of summary statements and their corresponding comments, sends them to
 * a large language model (LLM) for analysis, and determines whether each statement introduces
 * fabricated information not present in the comments. It then generates a report summarizing the
 * results, including the percentage of statements with and without hallucinations, and saves the
 * detailed results to a CSV file.
 *
 * @param model The Vertex AI model instance to use for the evaluation.
 * @param summaries An array of `StatementWithComments` objects, where each object contains a summary statement and its associated comments.
 * @param outputDir The directory to save the evaluation results (CSV with each result and report).
 */
export async function rateHallucination(
  model: VertexModel,
  summaries: StatementWithComments[],
  outputDir: string
) {
  const startTimeTotal = performance.now();

  const autoratingResults = [
    [
      "Generated Statement",
      "Source Comments",
      "Has Hallucinations?",
      "LLM Analysis",
      "LLM Explanation",
      "Runtime (seconds)",
    ],
  ]; // Header row

  const aggregatedResults: AutoratingAggregatedResults = {
    totalStatements: 0,
    questions: {
      Hallucinations: { pass: 0, fail: 0, unsure: 0 },
    },
  };

  for (const { statement, comments } of summaries) {
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("STATEMENT:");
    console.log(statement);
    console.log("INPUT COMMENTS:");
    console.log(comments);
    console.log("~~~~~~~~~~~~~~~~~~~");

    const prompt = `
You are analyzing a statement that attempts to summarize a comment or a set of comments.

STATEMENT:
${statement}

INPUT COMMENTS:
${comments}

INSTRUCTIONS:
Step 1. Statement Breakdown and Evidence Mapping:
a. Break down the statement into individual units of information.  Each distinct topic, claim, or assertion should be considered a separate unit.
b. For each unit of information, determine if it is mentioned in any of the provided INPUT COMMENTS.
 * If the unit of information is supported by one or more comments, list the number(s) of the supporting comment(s) in square brackets after the unit. For example:  "improving educational opportunities[2]" (if supported by comment 2).  If multiple comments support the unit, list all of them: "environment[1,3]".
 * If the unit of information is NOT mentioned in *any* of the comments, mark it with an "X" in square brackets to indicate hallucination.  For example:  "supporting local businesses[X]"
c. Present the complete statement with the bracketed evidence tags. Example: "High consensus was reached on topics such as preserving green spaces[1], supporting local businesses[X], and improving educational opportunities[2]."

Step 2. Answer the following question with "YES", "NO" or "MAYBE", followed by a *brief* explanation of the reasoning behind why this answer was given:
- Does the statement contain fabricated information *not* mentioned in the comments?  (YES indicates hallucination/fabrication).

RESPONSE STRUCTURE:
Respond with your analysis, followed by the "YES", "NO" or "MAYBE" answers to the questions, and a brief explanation for each answer.
The response should be in JSON format. For example:
{"analysis": "...", "answer": "NO", "explanation": "NO because..."}
`;

    const startTimeStatement = performance.now();

    let response: ResponseType | null = null;
    try {
      response = (await model.generateData(prompt, ResponseSchema)) as ResponseType;
    } catch (error) {
      console.error("Error during LLM call or parsing:", error);
      autoratingResults.push([statement, comments, "NULL", "NULL", "NULL", "NULL"]);
      continue; // Skip to the next statement if there's an error
    }
    if (!response) {
      console.warn("Skipping statement due to LLM error or invalid response.");
      autoratingResults.push([statement, comments, "NULL", "NULL", "NULL", "NULL"]);
      continue; // Skip to the next statement if the response is invalid
    }

    console.log("~~~~~~~~~~~~~~~~~~~");
    console.log("MODEL RESPONSE:");
    console.log(response);
    console.log("~~~~~~~~~~~~~~~~~~~");

    const statementRuntimeSec = (performance.now() - startTimeStatement) / 1000;
    console.log(`STATEMENT hallucination check took ${statementRuntimeSec} seconds.`);

    // populate CSV table
    autoratingResults.push([
      statement,
      comments,
      response.answer,
      response.analysis,
      response.explanation,
      statementRuntimeSec.toFixed(2),
    ]);

    // update aggregated results
    const hasHallucinations = response.answer;
    if (hasHallucinations === "YES") {
      aggregatedResults.questions["Hallucinations"].fail++;
    } else if (hasHallucinations === "NO") {
      aggregatedResults.questions["Hallucinations"].pass++;
    } else if (hasHallucinations === "MAYBE") {
      aggregatedResults.questions["Hallucinations"].unsure++;
    }
    aggregatedResults.totalStatements++;

    console.log("AUTORATING RESULTS:");
    console.log(aggregatedResults);

    // await new Promise(resolve => setTimeout(resolve, 1000)); // uncomment if hit lots of rate limiting
  }

  // Save autoratings data in CSV format
  const csvString = autoratingResults
    .map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const outputFilePath = path.join(outputDir, "hallucination_autoratings.csv");
  fs.mkdirSync(path.dirname(outputFilePath), { recursive: true }); // Create the directory if it doesn't exist
  try {
    fs.writeFileSync(outputFilePath, csvString);
    console.log(`CSV data saved to ${outputFilePath}`);
  } catch (error) {
    console.error("Error writing CSV data to file:", error);
  }

  // Generate report
  const totalRuntimeMin = (performance.now() - startTimeTotal) / (1000 * 60);
  const report = generateEvaluationReport(aggregatedResults, totalRuntimeMin);
  console.log(report);
  const reportFilePath = path.join(outputDir, "hallucination_report.txt");
  try {
    fs.writeFileSync(reportFilePath, report);
    console.log(`Report saved to ${reportFilePath}`);
  } catch (error) {
    console.error("Error writing report to file:", error);
  }
}
