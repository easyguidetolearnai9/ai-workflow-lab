/* Standalone educational fixture evaluator. No network or storage. */
(function (root) {
  'use strict';
  function evaluate(csv) {
    const lines = csv.trim().replace(/\r/g, '').split('\n');
    if (lines.shift() !== 'event_id,ticket_id,revision,status') throw new Error('Use the supplied four-column CSV header.');
    const events = new Map();
    for (const [index, line] of lines.entries()) {
      const fields = line.split(',');
      if (fields.length !== 4) throw new Error(`Row ${index + 2}: expected four plain CSV fields.`);
      const [event, ticket, version, status] = fields.map(x => x.trim());
      if (!/^E\d+$/.test(event) || !/^T\d+$/.test(ticket) || !/^[1-9]\d*$/.test(version) || !Number.isSafeInteger(Number(version))) {
        throw new Error(`Row ${index + 2}: invalid event, ticket or revision.`);
      }
      const row = {event, ticket, revision: Number(version), status};
      if (events.has(event) && JSON.stringify(events.get(event)) !== JSON.stringify(row)) {
        throw new Error(`Conflicting payload for ${event}; resolve it before processing.`);
      }
      events.set(event, row);
    }
    const revisions = new Map();
    const latest = new Map();
    for (const row of events.values()) {
      const key = `${row.ticket}:${row.revision}`;
      if (revisions.has(key) && revisions.get(key) !== row.status) throw new Error(`Conflicting status at ${key}; resolve it before processing.`);
      revisions.set(key, row.status);
      if (!latest.has(row.ticket) || latest.get(row.ticket).revision < row.revision) latest.set(row.ticket, row);
    }
    const followUp = [], review = [];
    for (const row of latest.values()) {
      if (row.status === 'Open') followUp.push(row.ticket);
      else if (row.status !== 'Closed') review.push(row.ticket);
    }
    return {followUp: followUp.sort(), review: review.sort(), uniqueEvents: events.size, duplicateDeliveries: lines.length - events.size};
  }
  function compareIds(answer, expected) {
    const ids = answer.trim() ? answer.trim().toUpperCase().split(/[\s,]+/) : [];
    const duplicates = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
    const missing = expected.filter(id => !ids.includes(id));
    const extra = [...new Set(ids.filter(id => !expected.includes(id)))];
    return {pass: !duplicates.length && !missing.length && !extra.length, duplicates, missing, extra};
  }
  const api = {evaluate, compareIds};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ReplayExercise = api;
})(typeof globalThis === 'undefined' ? this : globalThis);
