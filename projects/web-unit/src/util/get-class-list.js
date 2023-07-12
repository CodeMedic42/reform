async function getClassList(elementHandle) {
    return elementHandle.evaluate((el) => [...el.classList]);
}

export default getClassList;
