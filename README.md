# Spiel Library

A "Spiel" is a term I've coined for a data structure used for speech or communication meeting these criteria:

* The specified communication is essentially linear, e.g. character says A then B then C.
* Further specification of replies to vocal interruptions or other user-provided inputs is possible.

Imagine a waiter describing a restaurant's specials of the day. They would talk through their offerings in a linear way. But you could interrupt them along the way, e.g. "Is the the salmon gluten-free?" A Spiel can contain the information to describe all the restaurant specials, as well as respond to a patron's questions and comments along the way.

In interactive games, the Spiel is a useful tool in giving a sense of human interaction without all of the possibilities multiplying exponentially. In this way, a content author can practically design conversations without it becoming untenable.

## Features

* Serialize and deserialize the YAML-based Spiel format.
* Character and emotion associated with lines.
* Traversing, querying, and processing a Spiel.
* Generate keyword matchers that efficiently check which replies match keyword inputs.
* Import the linear portion of a Spiel from a Fountain screenplay format.

## Usage




## Non-Goals and Architectural Boundaries

* DOES NOT include presentational functionality.
* DOES NOT include I/O functionality, e.g. audio, user input, files, HTTP.
* Includes a basic iterator to traverse spiel, but is otherwise agnostic to the state of the spiel during a conversation. Library caller must create whatever state machine logic is appropriate for spiel traversal.

## Data Structure

SPIEL = 
* 0+ NODE
* 0+ Root REPLIES
* Default Character (string)
* Next Node ID (number)

REPLY =
* LINE
* Match Criteria (string[])

NODE = 
* Node ID (number)
* LINE
* 0+ REPLIES

LINE =
* Character (string)
* Dialogue (string[])
* Emotion (enum)
