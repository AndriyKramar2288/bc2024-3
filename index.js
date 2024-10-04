// імпорт бібліотеки для реалізації інтерфейсу командного рядка
const { program } = require('commander');
// імпорт бібліотеки для роботи з файлами
const fs = require('node:fs');


function preparing() {
	/*
		Виконує багато підготовчих дій для роботи програми, зокрема
		обробляє параметри програми й читає файл з вхідними даними

		Примітка: викликати цю функцію можна лише раз, бо інакше
		    вилізе помилка (адже параметри на program вже задані)
	*/
	// опис параметрів програми
	program
	.option("-i, --input <value>", "Шлях до \"вхідного\" файлу")
	.option("-o, --output <value>", "Шлях до \"вихідного\" файлу", "output.txt")
	.option("-d, --display", "Чи відображати вихідні дані одразу у консоль");
	// парсинг тих параметрів
	program.parse();
	// отримання об'єкта, для зручного одержання параметрів
	const options = program.opts();
	// перевірка параметрів на правильність
	// перевірка, чи був введений параметр шляху до файлу з вхідними даними
	// (обов'язковий параметр!)
	if (!options.input) {
		throw Error("Please, specify input file");
	}
	// змінна для вхідних даних
	let input_string = null;	
	try {
		input_string = fs.readFileSync(options.input);
	}
	catch (ENOENT) { // разі некоректно введеного шляху, буде така помилка
		throw Error("Cannot find input file");
	}

	return [options, input_string];	
}


function ending(options, output_string) {
	/*
		Після обробки вхідних даних, ця функція робить ті дії з вхідними
		даними, які побажав користувач.
	*/
	if (options.output) {
	fs.writeFileSync(options.output, output_string);
	}
	if (options.display) {
		console.log(output_string);
	}
}

function main() {
	const preparing_result = preparing(); 
	const options = preparing_result[0];
	const input_string = preparing_result[1];

	let jsonische = JSON.parse(input_string);
	jsonische = jsonische.filter((element) => element["parent"] == "BS3_BanksLiab");
	let output_string = "";
	for (let item of jsonische) {
		output_string += `${item["txten"]}:${item["value"]}\n`;
	}

	ending(options, output_string);
}

main();




