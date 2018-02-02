// only for demo purposes
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// only for demo purposes
export async function waitTwoSeconds(seconds) {
    console.log('Taking a break...');
    await sleep(seconds);
    console.log('... ' + (seconds/1000) + ' seconds later');
}