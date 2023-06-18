const processChoices = (choices) => {
    const newLinesRemoved = choices.replace(/\n+/g, '\n');
    const spacesRemoved = newLinesRemoved.replace(/\n\s+/g, '\n');
    let result = spacesRemoved.replace(/###/g, "");
    result = result.replace(/##/g, "");
    result = result.replace(/#/g, "");
    return result;
}

module.exports = processChoices;