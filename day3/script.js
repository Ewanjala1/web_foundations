// Day 3 Assignment: Notes Toolkit Functions

// Starting Data
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

/**
 * 1. searchNotes(word)
 * Returns an array of notes whose text contains word, ignoring upper and lower case.
 * Uses filter, toLowerCase, and includes.
 */
function searchNotes(word) {
  const lowerWord = word.toLowerCase();
  return notes.filter((note) => note.text.toLowerCase().includes(lowerWord));
}

/**
 * 2. longestNote()
 * Returns the note object with the most characters, or null if there are no notes.
 * Handles the empty array first, then compares lengths.
 */
function longestNote() {
  if (notes.length === 0) {
    return null;
  }

  let longest = notes[0];
  for (let i = 1; i < notes.length; i++) {
    if (notes[i].text.length > longest.text.length) {
      longest = notes[i];
    }
  }
  return longest;
}

/**
 * 3. countByCategory()
 * Returns an object counting notes per category, such as { personal: 2, work: 1, study: 2 }.
 * Loops over the notes and increases a counter in an object.
 */
function countByCategory() {
  const counts = {};
  for (const note of notes) {
    const category = note.category;
    if (counts[category]) {
      counts[category]++;
    } else {
      counts[category] = 1;
    }
  }
  return counts;
}

/**
 * 4. getSummary()
 * Returns a sentence such as "5 notes: 2 personal, 1 work, 2 study."
 * Uses countByCategory and a template literal.
 * Uses "note" for exactly one note and "notes" otherwise.
 */
function getSummary() {
  const counts = countByCategory();
  const total = notes.length;
  const noteWord = total === 1 ? "note" : "notes";
  const categoryDetails = Object.entries(counts)
    .map(([cat, count]) => `${count} ${cat}`)
    .join(", ");

  return categoryDetails
    ? `${total} ${noteWord}: ${categoryDetails}.`
    : `${total} ${noteWord}.`;
}

/**
 * 5. isDuplicate(text)
 * Returns true if a note with the same text already exists (ignoring case and extra spaces).
 * Uses some, comparing trimmed lower-case text.
 */
function isDuplicate(text) {
  const cleanText = text.trim().toLowerCase();
  return notes.some((note) => note.text.trim().toLowerCase() === cleanText);
}

/**
 * 6. addNote(text, category)
 * Adds a note only if it is 1–200 characters, is not a duplicate,
 * and the category is one of personal, work, or study.
 * Returns true when added and false otherwise, logging the reason.
 */
function addNote(text, category) {
  // Check length (1–200 characters)
  const trimmedText = typeof text === "string" ? text.trim() : "";
  if (trimmedText.length < 1 || trimmedText.length > 200) {
    console.log("Failed to add note: Note text must be between 1 and 200 characters.");
    return false;
  }

  // Check duplicate
  if (isDuplicate(text)) {
    console.log("Failed to add note: A note with this text already exists.");
    return false;
  }

  // Check category
  const validCategories = ["personal", "work", "study"];
  const normalizedCategory = typeof category === "string" ? category.trim().toLowerCase() : "";
  if (!validCategories.includes(normalizedCategory)) {
    console.log("Failed to add note: Category must be one of 'personal', 'work', or 'study'.");
    return false;
  }

  // Generate new unique ID
  const nextId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1;
  const newNote = {
    id: nextId,
    text: trimmedText,
    category: normalizedCategory,
  };

  notes.push(newNote);
  console.log(`Successfully added note: "${newNote.text}" (${newNote.category})`);
  return true;
}

// ==========================================
// Function Tests (at least two tests per function)
// ==========================================

console.log("--- Testing searchNotes ---");
// Normal case: search matches a note
console.log(searchNotes("milk")); // Expected: [ { id: 1, text: "Buy milk and bread", category: "personal" } ]
// Edge case: search word not found (empty array returned)
console.log(searchNotes("xylophone")); // Expected: []
// Normal case: case-insensitive search
console.log(searchNotes("JAVASCRIPT")); // Expected: [ { id: 4, text: "Revise JavaScript arrays", category: "study" } ]

console.log("\n--- Testing longestNote ---");
// Normal case: returns the note object with the most characters
console.log(longestNote()); // Expected: { id: 3, text: "Email the project report to Grace", category: "work" }
// Edge case: empty notes array returns null
const savedNotes = [...notes];
notes = [];
console.log(longestNote()); // Expected: null
notes = [...savedNotes]; // Restore notes

console.log("\n--- Testing countByCategory ---");
// Normal case: returns counts object per category
console.log(countByCategory()); // Expected: { personal: 2, study: 2, work: 1 }
// Edge case: empty notes array returns empty object
notes = [];
console.log(countByCategory()); // Expected: {}
notes = [...savedNotes]; // Restore notes

console.log("\n--- Testing getSummary ---");
// Normal case: multiple notes summary sentence
console.log(getSummary()); // Expected: "5 notes: 2 personal, 2 study, 1 work."
// Edge case: exactly one note uses singular "note"
notes = [{ id: 1, text: "Solo note", category: "personal" }];
console.log(getSummary()); // Expected: "1 note: 1 personal."
notes = [...savedNotes]; // Restore notes

console.log("\n--- Testing isDuplicate ---");
// Normal case: duplicate exists (ignoring case and whitespace)
console.log(isDuplicate("   buy MILK and bread   ")); // Expected: true
// Edge case: new unique note text returns false
console.log(isDuplicate("Read a new book")); // Expected: false

console.log("\n--- Testing addNote ---");
// Normal case: valid note is added
console.log(addNote("Prepare presentation slides", "work")); // Expected: true
// Edge case 1: duplicate note is rejected
console.log(addNote("Buy milk and bread", "personal")); // Expected: false
// Edge case 2: invalid category is rejected
console.log(addNote("Meditate for 10 minutes", "wellness")); // Expected: false
// Edge case 3: empty text is rejected
console.log(addNote("", "study")); // Expected: false
// Edge case 4: text longer than 200 characters is rejected
console.log(addNote("A".repeat(201), "personal")); // Expected: false
