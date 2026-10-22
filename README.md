# AI Workflow Lab: can your follow-up list survive a replay?

A nine-row exercise for spreadsheets, no-code tools and AI-assisted scripts. Catch stale updates, duplicate deliveries and guessed statuses before connecting a workflow to real actions.

**No API key, paid service or Discord membership is needed.** All data is fictional. This is an AI-assisted educational resource maintained for the **artificial intelligence** Discord community.

## Start here: find the bug without writing code

Someone proposes this method:

> Keep the Open rows, remove duplicate tickets, then send a follow-up to each ticket.

Use the history below. Which ticket would that method follow up even though its latest status is Closed? Explain which two rows prove it. You can contribute that explanation without building an automation.

```csv
event_id,ticket_id,revision,status
E01,T01,1,Open
E02,T02,1,Open
E03,T01,2,Closed
E04,T03,1,Open
E02,T02,1,Open
E05,T01,1,Open
E06,T04,1,
E07,T05,1,Pending
E08,T06,1,Closed
```

<details>
<summary>Check the explanation</summary>

T01 is the counterexample. E01 says Open at revision 1, but E03 says Closed at revision 2. E05 repeats an older Open state later in the file. Filtering Open rows first hides the newer closure. Choose the greatest numeric revision before deciding whether to follow up.

</details>

## Build a solution

Produce two lists: **follow up** and **needs review**. List each ticket once.

1. Process an exact repeated `event_id` once.
2. Use the greatest numeric `revision` for each ticket. File order does not establish recency.
3. Current `Open` means follow up; current `Closed` means exclude. A blank or other current status means review.
4. A repeated event ID with different data, or conflicting statuses for the same ticket and revision, is an input error. Stop and resolve it before producing the lists.

Try it with [round-1.csv](round-1.csv). Save your method and actual output, then replay the same history. The ticket lists should stay the same.

### Check locally

Download the repository using GitHub's **Code → Download ZIP**, extract it and open `index.html`. The checker includes both datasets and compares the IDs you enter. It does not execute your workflow or submit your answers.

If you already have Node.js, run the reference checks without installing dependencies:

```sh
node test.cjs
```

The reference evaluator accepts the supplied plain, unquoted four-column fixture format, not arbitrary CSV. It trims surrounding field whitespace, treats statuses as case-sensitive, requires E/T followed by digits for IDs, and requires positive safe integers for revisions.

## Come back with a change

On a later day, append these rows to the original history, keeping one header. [The additions are also available as a CSV](round-2-additions.csv).

```csv
E09,T02,2,Closed
E10,T03,2,Closed
E11,T07,1,Open
E11,T07,1,Open
E12,T01,3,Open
E13,T04,2,Closed
E14,T05,2,Open
```

Run the same method again. Report the actual output and either a correction you made or why the method handled the changed input without modification. If you reviewed someone else's method, name the rule you checked and what you observed.

| Round | Follow up | Review |
| --- | --- | --- |
| 1 | T02, T03 | T04, T05 |
| 2, full combined history | T01, T05, T07 | none |

## Three ways to contribute

- **Explain:** show the smallest example that breaks the flawed method above.
- **Build:** share a spreadsheet formula or a small script, with actual outputs for both rounds.
- **Check:** try another person's method against a replay, a reversed history or a conflicting event. Report what happened.

Use the repository's result-report issue template, or keep your notes locally. Public contributions should contain only fictional data. Code, formulas and plain-language explanations are all welcome. AI-assisted suggestions should include what you personally ran or checked; an untested suggestion is welcome if marked as untested.

## Optional peer discussion

We maintain the **artificial intelligence** Discord: https://discord.gg/artificialintelligence. If you want to compare results there, go to **#questions-and-help** and look for the nine-row workflow exercise. Bring this small result card:

```text
Round and date:
Method or rule I checked:
Actual follow-up IDs / review IDs:
One failure, correction or explanation:
On my next visit, I will check:
```

On that next visit, reply to your own result with what you actually observed. Reviewing a peer's result is useful too. Joining is optional, and no review or response time is guaranteed. GitHub activity alone is not counted as Discord participation.

## Limits and reuse

This tests batch state reconstruction. It does not prove exactly-once production writes, safe messaging, concurrency handling or any AI model's performance. The browser checker has no analytics, network requests, account system or saved answers; its optional Discord link opens an external site when clicked.

The original exercise, fictional data and code use the [MIT license](LICENSE). See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution format.
