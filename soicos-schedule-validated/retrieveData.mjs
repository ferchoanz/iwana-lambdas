import axios from "axios";
import { writeFile } from "fs";

const formatData = (item) => {
    const obj = {};
    for (const key in item) {
        const element = item[key];
        if (typeof element === 'object') {
            for (const deepKey in element) {
                obj[`${key}_${deepKey}`] = element[deepKey];
            }
        } else {
            obj[key] = element;
        }
    }
    return obj;
};

const getData = async () => {
    let data = [];
    let url = `https://api.soicos.com/api/transactions/validated/2023-02-21/2023-02-28/0/validated?token=6b0ebc57e98077b2e7651819bfb33763&aid=37345`;
    do {
        const response = await axios.get(url).then(res => res.data).catch(() => null);
        const retriveData = response?.data || [];
        data = [...data, ...retriveData];
        console.log({ url });
        url = response?.links?.next;
    } while (url);

    writeFile('./data.json', JSON.stringify(data), e => {
        if (e) {
            console.error({ error: e });
        }
    });

    data = data.map(item => formatData(item));

    writeFile('./formatData.json', JSON.stringify(data), e => {
        if (e) {
            console.error({ error: e });
        }
    });
};

getData();