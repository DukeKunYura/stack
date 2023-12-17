const fs = require("fs");

const path = "checks.txt";
const pathResult = "result.txt";

let lines = [];

// функция преобразования данных
const transformData = (lines) => {
  // массив месяцев
  const months = [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь",
  ];

  // массив файлов для каждого месяца
  const filesByMonth = [];
  months.forEach((month) => {
    filesByMonth[month] = [];
  });

  // разложить файлы по месяцам
  lines.forEach((line) => {
    const month = line.split("_")[1].split(".")[0];
    filesByMonth[month].push(line);
  });

  // массив для новых адресов файлов
  const pathToFiles = [];

  for (const documents of Object.values(filesByMonth)) {
    documents.forEach((file) => {
      let pathToFile = "/";
      pathToFile += file.split("_")[1].split(".")[0];
      pathToFile += "/";
      pathToFile += file.split("_")[0];
      pathToFile += ".pdf";
      pathToFiles.push(pathToFile);
    });
  }

  // массив для неоплаченных счетов
  const checkMissing = [];

  for (const documents of Object.values(filesByMonth)) {
    const checkingMouth = documents[0].split("_")[1].split(".")[0];
    let checks = "";
    documents.forEach((file) => {
      checks += file;
    });
    const missing = [];
    if (!checks.includes("ТБО")) {
      missing.push("ТБО");
    }
    if (!checks.includes("газоснабжение")) {
      missing.push("газоснабжение");
    }
    if (!checks.includes("домофон")) {
      missing.push("домофон");
    }
    if (!checks.includes("квартплата")) {
      missing.push("квартплата");
    }
    if (!checks.includes("ХВС")) {
      missing.push("ХВС");
    }
    if (!checks.includes("ГВС")) {
      missing.push("ГВС");
    }
    if (!checks.includes("электроснабжение")) {
      missing.push("электроснабжение");
    }
    if (!checks.includes("капремонт")) {
      missing.push("капремонт");
    }
    if (missing.length > 0) {
      checkMissing.push(checkingMouth + ":");
      checkMissing.push(...missing);
    }
  }

  // Создать выходной файл
  const output = [];
  output.push(...pathToFiles);
  output.push("не оплачены:");
  output.push(...checkMissing);

  const outputString = output.join("\n");

  return outputString;
};

// чтение данных и сохранение результатов в файл
fs.readFile(path, "utf8", (error, data) => {
  if (error) {
    console.error(error);
    return;
  }

  lines = data.split("\n");

  const resultData = transformData(lines);

  fs.writeFile(pathResult, resultData, "utf8", (error) => {
    if (error) {
      console.error(error);
      return;
    }
  });
});
