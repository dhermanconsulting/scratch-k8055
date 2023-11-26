const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const TargetType = require('../../extension-support/target-type');

class Scratch3YourExtension {

    constructor (runtime) {
        // put any setup for your extension here
    }

    /**
     * Returns the metadata about your extension.
     */
    getInfo () {
        return {
            // unique ID for your extension
            id: 'K8055',

            // name that will be displayed in the Scratch UI
            name: 'K8055',

            // colours to use for your extension blocks
            color1: '#000099',
            color2: '#660066',

            // icons to display
            blockIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',
            menuIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',

            // your Scratch blocks
            blocks: [
                {
                    // name of the function where your block code lives
                    opcode: 'myFirstBlock',

                    // type of block - choose from:
                    //   BlockType.REPORTER - returns a value, like "direction"
                    //   BlockType.BOOLEAN - same as REPORTER but returns a true/false value
                    //   BlockType.COMMAND - a normal command block, like "move {} steps"
                    //   BlockType.HAT - starts a stack if its value changes from false to true ("edge triggered")
                    blockType: BlockType.REPORTER,

                    // label to display on the block
                    text: 'My first block [MY_NUMBER] and [MY_STRING]',

                    // true if this block should end a stack
                    terminal: false,

                    // where this block should be available for code - choose from:
                    //   TargetType.SPRITE - for code in sprites
                    //   TargetType.STAGE  - for code on the stage / backdrop
                    // remove one of these if this block doesn't apply to both
                    filter: [ TargetType.SPRITE, TargetType.STAGE ],

                    // arguments used in the block
                    arguments: {
                        MY_NUMBER: {
                            // default value before the user sets something
                            defaultValue: 123,

                            // type/shape of the parameter - choose from:
                            //     ArgumentType.ANGLE - numeric value with an angle picker
                            //     ArgumentType.BOOLEAN - true/false value
                            //     ArgumentType.COLOR - numeric value with a colour picker
                            //     ArgumentType.NUMBER - numeric value
                            //     ArgumentType.STRING - text value
                            //     ArgumentType.NOTE - midi music value with a piano picker
                            type: ArgumentType.NUMBER
                        },
                        MY_STRING: {
                            // default value before the user sets something
                            defaultValue: 'hello',

                            // type/shape of the parameter - choose from:
                            //     ArgumentType.ANGLE - numeric value with an angle picker
                            //     ArgumentType.BOOLEAN - true/false value
                            //     ArgumentType.COLOR - numeric value with a colour picker
                            //     ArgumentType.NUMBER - numeric value
                            //     ArgumentType.STRING - text value
                            //     ArgumentType.NOTE - midi music value with a piano picker
                            type: ArgumentType.STRING
                        }
                    }
                },
                {
                    // name of the function where your block code lives
                    opcode: 'setDigitalOn',

                    blockType: BlockType.COMMAND,
                    text: 'Set ouput [CHANNEL] to ON',
                    terminal: false,

                    filter: [ TargetType.SPRITE, TargetType.STAGE ],

                    arguments: {
                        CHANNEL: {
                            // default value before the user sets something
                            defaultValue: 1,
                            type: ArgumentType.NUMBER
                        }
                    }
                },
                {
                    // name of the function where your block code lives
                    opcode: 'setDigitalOff',

                    blockType: BlockType.COMMAND,
                    text: 'Set ouput [CHANNEL] to OFF',
                    terminal: false,

                    filter: [ TargetType.SPRITE, TargetType.STAGE ],

                    arguments: {
                        CHANNEL: {
                            // default value before the user sets something
                            defaultValue: 1,
                            type: ArgumentType.NUMBER
                        }
                    }
                },
                {
                    // name of the function where your block code lives
                    opcode: 'getDigitalIn',

                    blockType: BlockType.REPORTER,

                    // label to display on the block
                    text: 'Get Input [CHANNEL]',

                    // true if this block should end a stack
                    terminal: false,

                    filter: [ TargetType.SPRITE, TargetType.STAGE ],

                    // arguments used in the block
                    arguments: {
                        CHANNEL: {
                            // default value before the user sets something
                            defaultValue: 1,
                            type: ArgumentType.NUMBER
                        }
                    }
                }
            ]
        };
    }


    /**
     * implementation of the block with the opcode that matches this name
     *  this will be called when the block is used
     */
    myFirstBlock ({ MY_NUMBER, MY_STRING }) {
        // example implementation to return a string

        fetch("http://127.0.0.1:8080/get_all", {
            method: "GET" // default, so we can ignore
        })

        return MY_STRING + ' : doubled would be ' + (MY_NUMBER * 2);
    }

    setDigitalOn ({ CHANNEL }) {

        data = {
            channel: parseInt(CHANNEL, 10),
            enabled: true
        };

          fetch('http://127.0.0.1:8080/set_digital_out', { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })

          return true;

    }

    setDigitalOff ({CHANNEL}) {

        data = {
            channel: parseInt(CHANNEL, 10),
            enabled: false
        };

          fetch('http://127.0.0.1:8080/set_digital_out', { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })

          return true;

    }

    getDigitalIn( {CHANNEL} ) {

        const url = `http://127.0.0.1:8080/get_digital_in/${CHANNEL}`;
        
        return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            return data.enabled;
        })
        .catch(error => {
            console.error('Error fetching digital state:', error);
            // You can either handle the error here or rethrow it
            // to be handled by the caller of getDigitalState.
            throw error;
        });

    }
}

module.exports = Scratch3YourExtension;
