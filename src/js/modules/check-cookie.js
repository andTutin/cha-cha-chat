export default function (full, chunk) {
    let chunkLowcase = chunk.toLowerCase();
    let fullLowcase = full.toLowerCase();
    let match;

    match = (fullLowcase.indexOf(chunkLowcase) != -1) ? true : false

    return match;
}