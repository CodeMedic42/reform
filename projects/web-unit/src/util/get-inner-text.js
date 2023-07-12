async function getInnerText(elementHandle) {
    return elementHandle.evaluate((el) => el.innerText);
}

export default getInnerText;
