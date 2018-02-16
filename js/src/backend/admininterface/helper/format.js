export function changeFormat(duration) {

    let h = Math.floor(duration/3600000);
    duration = duration - ( h * 3600000);
    let m = Math.floor(duration/60000);
    duration = duration - ( m * 60000);
    let s = Math.floor(duration/1000);
    duration = duration - ( s * 1000);
    let ms = duration;
    let output = ""

    if(ms === 0){
        if(h === 0) {
            if(m === 0) {
                output = (s + "s");
            } else {
                output = (m + "min " + s + "s");
            }
        } else {
            output = (h + "h " + m + "min " + s + "s");
        }
    }else{
        let msS = ms
        if (ms < 10) {
            msS = '00' + ms
        } else if (ms < 100) {
            msS = '0' + ms
        }
        if(h === 0) {
            if(m === 0) {
                output = (s + "." + msS + "s");
            } else {
                output = (m + "min " + s + "." + msS + "s");
            }
        } else {
            output = (h + "h " + m + "min " + s + "." + msS + "s");
        }
    }
    return output;
}