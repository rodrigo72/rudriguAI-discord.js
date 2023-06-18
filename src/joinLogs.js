const fs = require('fs');
const path = require('path');

const getLinkLength = (str) => {
    const linkRegex = /(https?:\/\/[^\s]+)/;
    const linkMatch = str.match(linkRegex);
  
    if (linkMatch) {
        const link = linkMatch[0];
        return link.length;
    } else {
        return 0;
    }
}

const linkOccupiesMoreThanNPercent = (line, percentage) => {
    const urlLength = getLinkLength(line);
    const lineLength = line.length;
    return (urlLength / lineLength) > percentage;
};

const isBrunes = (line) => {
    return line.startsWith('A') && line.length > 10 && !line.includes(' ')   
}

const isBrunesExtreme = (line) => {
    return line.startsWith('A') && !line.includes(' ');
}

const removeEmojis = (str) => {
    const regex = /<:[^:]+:\d+>/g;
    const updatedStr = str.replace(regex, '');
    const emojiRegex = /<a:[^:]+:\d+>/g;
    return updatedStr.replace(emojiRegex, '');
}

const removeUserMentions = (str) => {
    const regex = /<@!?(\d+)>/g;
    return str.replace(regex, '');
}  

const replaceNewlines = (str) => {
    return str.replace(/\n/g, ". ");
}

const replaceQuotes = (str) => {
    return str.replace(/"+/g, "'");
}

const isJustSpaces = (str) => {
    const isWhitespaceOnly = /^\s*$/.test(str);
    return isWhitespaceOnly;
}

const joinAllFiles = () => {

    const directoryPath = path.join(__dirname, 'logs');
    const outputDirectory = path.join(__dirname, 'data');

    const outputFilePath = path.join(outputDirectory, 'data.jsonl');

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }
    
        const jsonlFiles = files.filter(file => path.extname(file) === '.jsonl');
        let fileContents = [];
    
        jsonlFiles.forEach(file => {
            const filePath = path.join(directoryPath, file);
            let content = fs.readFileSync(filePath, 'utf8');
            content = content
                .split('\n')
                .map(line => {
                    if (line) {
                        const { prompt, completion } = JSON.parse(line);
                        return JSON.stringify({ prompt: replaceNewlines(replaceQuotes(removeUserMentions(removeEmojis(prompt)))), 
                                                completion: replaceNewlines(replaceQuotes(removeUserMentions(removeEmojis(completion)))) 
                                            });
                    }
                    return line;
                })
                .filter(line => {
                    if (line) {
                        const { prompt, completion } = JSON.parse(line);
                        if (linkOccupiesMoreThanNPercent(prompt, 0.5) || linkOccupiesMoreThanNPercent(completion, 0.5) || 
                            completion.includes("###")  || completion.startsWith('```') || completion.endsWith('```')  ||
                            prompt.includes("###")      || prompt.startsWith('```')     || prompt.endsWith('```')      ||
                            prompt.length >= 260        || completion.length >= 500     ||
                            prompt.length <= 1          || completion.length <= 1       ||
                            isBrunesExtreme(prompt)     || isBrunes(completion)         ||
                            prompt.startsWith('!')      || completion.startsWith('!')   || 
                            prompt.startsWith('$')      || completion.startsWith('$')   ||
                            (prompt.startsWith('<')     && prompt.endsWith('>'))        ||
                            (completion.startsWith('<') && completion.endsWith('>'))    ||
                            prompt.startsWith('💗')    || isJustSpaces(prompt) || isJustSpaces(completion)) {
                                return false;
                        }
                        return true;
                    } else {
                        return false;
                    }
                });

            fileContents.push(content.join('\n'));
        });

        const joinedContents = fileContents.join('\n');

        fs.writeFileSync(outputFilePath, joinedContents, err => {
            if (err) {
                console.error('Error writing to file:', err);
                return;
            }
            console.log('Successfully joined files into data.jsonl');
        });

    });
}

module.exports = { joinAllFiles };
