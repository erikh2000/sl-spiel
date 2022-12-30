# Spiel Library

A "Spiel" is a term I've coined for a data structure used for speech or communication meeting these criteria:

* The specified communication is essentially linear, e.g. character says A then B then C.
* Further specification of replies to vocal interruptions or other user-provided inputs is possible.

Imagine a waiter describing a restaurant's specials of the day. They would talk through their offerings in a linear way. But you could interrupt them along the way, e.g. "Is the the salmon gluten-free?" A Spiel can contain the information to describe all the restaurant specials, as well as respond to a patron's questions and comments along the way.

In interactive games, the Spiel is a useful tool in giving a sense of human interaction without all of the possibilities multiplying exponentially. In this way, a content author can practically design conversations without it becoming untenable.

## Features

* Serialize and deserialize the YAML-based Spielfile format.
* Character and emotion associated with lines.
* Traversing, querying, and processing a Spiel.
* Generate keyword matchers that efficiently check which replies match keyword inputs.
* Import the linear portion of a Spiel from a Fountain screenplay format.

## Usage

### Creating a New Spiel from Scratch

The code below creates a new spiel populated with two nodes containing lines of dialogue for a Biff character to say. The call to `addReply()` after the first node will cause Biff to reply "Lots and lots of things!" if the user says something that matches one of 3 keyphrases. 

```
import { Spiel } from 'sl-spiel';

const spiel = new Spiel();
spiel.createNode('BIFF', Emotion.IRRITATED, 'I've got a lot of things to say.');
spiel.addReply('like what / what...things / what...say', 'Lots and lots of things!');
spiel.createNode('BIFF', Emotion.NEUTRAL, 'The first thing is...');
```

### Adding Root Replies

Root replies work the same as replies, except that matching for them is active on every node.

```
import { Spiel } from 'sl-spiel';

const spiel = new Spiel();
spiel.addRootReply('shut up', 'No, you shut up!', 'BIFF', Emotion.ANGRY);
```

### Exporting a Spiel to a SpielFile.

```
import { Spiel, exportSpielFile } from 'sl-spiel';

const spiel = new Spiel();
spiel.createNode('BIFF', Emotion.IRRITATED, 'I've got a lot of things to say.');
const text = exportSpielFile(spiel);
// Write text to a file, using file I/O. Or save to IndexedDB, post to a service endpoint, etc.

```

### Importing a Spiel from a SpielFile.

```
// Next line would work if you have a WebPack loader set up for yaml files, but any
// means of reading the text of a spielfile into a string can be used.
import spielFileText from 'spielFiles/example.spiel.yaml'; 
import { importSpielFile, Spiel } from 'sl-spiel'; 

const spiel = importSpielFile(spielFileText);
```

### Traversing a Spiel and Checking for Matches

```
import { Spiel } from 'sl-spiel';

const spiel = new Spiel();
spiel.createNode('BIFF', Emotion.IRRITATED, 'I've got a lot of things to say.');
spiel.addReply('like what / what...things / what...say', 'Lots and lots of things!');
spiel.createNode('BIFF', Emotion.NEUTRAL, 'The first thing is...');

spiel.moveFirst(); // There's also similar methods for moving to next, previous, last, and indexed-based nodes.
console.log(spiel.currentNode.nextDialogue()); // "I've got a lot of things to say."
const reply = spiel.checkForMatch('what do you have to say');
if (reply) console.log(reply.nextDialogue()); // "Lots and lots of things!"
```

### Adding Random Variants to Dialogue

Often, you want to have variants of the same phrase to avoid character dialogue feeling too repetitious. The `.nextDialogue()` method of nodes and replies, can choose a random dialogue text if you have specificied multiple dialogues texts for a node or reply.

```
import { Spiel } from 'sl-spiel';
const spiel = new Spiel();
spiel.createNode('BIFF', Emotion.IRRITATED, 'I've got a lot of things to say. / There is so much I can tell you.');

spiel.moveFirst();
console.log(spiel.currentNode.nextDialogue()); // "I've got a lot of things to say."
console.log(spiel.currentNode.nextDialogue()); // "There is so much I can tell you."
```

## Non-Goals and Architectural Boundaries

* DOES NOT include presentational functionality.
* DOES NOT include I/O functionality, e.g. audio, user input, files, HTTP.

### Contributing

The project isn't open to contributions at this point. But that could change. Contact me if you'd like to collaborate.

### Contacting

You can reach me on LinkedIn. I'll accept connections if you will just mention "SL Spiel" or some other shared interest in your connection request.

https://www.linkedin.com/in/erikhermansen/