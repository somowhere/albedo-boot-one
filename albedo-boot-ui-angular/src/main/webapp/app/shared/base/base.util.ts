export const containSpiltStr = (str: string, item: string, split?: string): Boolean => {
    var tempSplit = split ? split : ",";
    return tempSplit.concat(str, tempSplit).indexOf(tempSplit.concat(item, tempSplit)) != -1;
}



