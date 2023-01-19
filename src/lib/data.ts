import { reportData } from "./stores";

const csvParse = (input: string) => {
    const fileData = input;

    const splitFileData = fileData.split("\n");

    const fieldNamesWithSpaces = splitFileData[0].trim().split(",");

    // modify field names to not allow spaces -> replace with underscore
    const fieldNames = fieldNamesWithSpaces.map(fn =>
        fn.trim().toLowerCase().replaceAll(' ', '_'))

    const parsedData = [];

    for (let i = 1; i < splitFileData.length; i++) {
        const currentLine = splitFileData[i];
        const lineItems = currentLine.split(",");
        const currentLineObject: Record<string, string> = {};

        for (let j = 0; j < lineItems.length; j++) {
            currentLineObject[fieldNames[j]] = lineItems[j].replace('\r', '');
        }

        if (currentLineObject[fieldNames[0]].length > 0) {
            parsedData.push(currentLineObject);
        }
    }
    return parsedData;
};

interface ElementResult {
    value: number;
    dupValue?: number;
}

interface SubmissionMeta {
    hasDup: boolean;
}

export interface SubmissionResult {
    results: Map<string, ElementResult>;
    meta: SubmissionMeta
}

interface InputLine {
    analyte: string;
    concentration: string;
    dilution_factor: string;
    mass: string;
    sample_name: string;
    saple_weight_or_volume: string;
    units: string;
}

const parseToNumber = (datum: string | number) => {
    if (typeof datum === 'number') return datum;

    const castDatum = Number(datum);
    if (isNaN(castDatum)) throw new Error('Invalid number provided');
    return castDatum;
}

const parseJsonData = (rawInput: Record<string, string>[]) => {
    const input = rawInput as unknown as InputLine[];

    const runMap: Map<string, SubmissionResult> = new Map();

    const sampleDupRegex = /\d{2}-\d{6}-\d{4}d|dup/i;
    const otherDupRegex = /^.* d+u?p?\s?$/i;



    input.forEach(line => {
        let isDup = false;
        let sampleName = line.sample_name;

        if (sampleDupRegex.test(sampleName) || otherDupRegex.test(sampleName)) {
            isDup = true;
            const nameMatch = sampleName.match(/(.*) [dup]+/i)
            if (nameMatch && nameMatch[0] && typeof nameMatch[1] === 'string') sampleName = nameMatch[1];
            else return;

        }

        if (!runMap.has(sampleName)) {
            runMap.set(sampleName, {
                meta: { hasDup: isDup },
                results: new Map()
            })
        }
        const currentResults = runMap.get(sampleName)?.results;
        const currentElement = `${line.mass}${line.analyte}`;
        if (isDup && currentResults?.has(currentElement)) {
            const currentElementResults = currentResults.get(currentElement);
            if (currentElementResults && currentElementResults.value) currentElementResults.dupValue = parseToNumber(line.concentration);
            const currentSample = runMap.get(sampleName);
            if (currentSample) currentSample.meta.hasDup = true;
        }
        else currentResults?.set(currentElement, { value: parseToNumber(line.concentration) })
    })

    return runMap
};

const roundToSigFigs = (number: number, sigFigs: number) => {
    let oom = 0;
    let result = Number(number);

    if (number > 10) {
        while (result > 10) {
            result /= 10;
            oom += 1;
        }
    } else if (number < 0.0001 && number > 0) {
        return "0.00";
    } else if (number < 10) {
        while (result < 1 && result > 0) {
            if (result < 0) {
                result = result * -1;
            }
            result = result * 10;
            oom += 1;
        }
    }
    if (number > 10) {
        result = number / Math.pow(10, oom);
        result = result * Math.pow(10, sigFigs - 1);
        result = Math.round(result);
        result = result / Math.pow(10, sigFigs - oom - 1);
        return result.toPrecision(sigFigs);
    } else if (number < 0) {
        result = number * Math.pow(10, sigFigs + 1);
        result = Math.round(result);
        result = result / Math.pow(10, sigFigs + 1);
        return result.toPrecision(sigFigs);
    } else if (number < 1) {
        result = number * Math.pow(10, oom);
        result = result * Math.pow(10, sigFigs - 1);
        result = Math.round(result);
        result = result / Math.pow(10, sigFigs + oom - 1);
        return result.toPrecision(sigFigs);
    } else {
        return number.toPrecision(sigFigs);
    }
};


export const parseCsvToMap = (inputFile: File) => {
    const reader = new FileReader();
    let parsedData: Map<string, SubmissionResult> = new Map();
    reader.readAsText(inputFile);
    reader.onloadend = () => {
        if (!reader.result || typeof reader.result != 'string') return;
        const jsonData = csvParse(reader.result);
        parsedData = parseJsonData(jsonData);
        reportData.set(parsedData)
    }
}