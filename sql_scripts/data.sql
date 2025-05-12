-- Языки, словари, коды..
DELIMITER //
INSERT INTO Languages (Name, HighlightName) VALUES ('Python', 'python');
INSERT INTO Languages (Name, HighlightName) VALUES ('C++', 'cpp');
INSERT INTO Languages (Name, HighlightName) VALUES ('Java', 'text/x-java');
INSERT INTO Languages (Name, HighlightName) VALUES ('Kotlin', 'text/x-kotlin');
INSERT INTO Languages (Name, HighlightName) VALUES ('JavaScript', 'javascript');

INSERT INTO Dictionaries (Name, Languages_idLanguage, NumberOfCodesForStudent) VALUES ('PythonFactorial', 1, 1);
INSERT INTO Dictionaries (Name, Languages_idLanguage, NumberOfCodesForStudent) VALUES ('baseCppCodes', 2, 10);
INSERT INTO Dictionaries (Name, Languages_idLanguage, NumberOfCodesForStudent) VALUES ('sklearnExamples', 1, 15);
INSERT INTO Dictionaries (Name, Languages_idLanguage, NumberOfCodesForStudent) VALUES ('JavaBasics', 3, 8);
INSERT INTO Dictionaries (Name, Languages_idLanguage, NumberOfCodesForStudent) VALUES ('KotlinExamples', 4, 5);
INSERT INTO Dictionaries (Name, Languages_idLanguage, NumberOfCodesForStudent) VALUES ('JSFunctions', 5, 6);


INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (2, 'int result = a + b * c;');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (2, 'std::vector<int> numbers = {1, 2, 3, 4, 5};');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (2, 'std::cout << "Hello, world!" << std::endl;');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (2, 'for (int i = 0; i < 10; i++) std::cout << i << " ";');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (2, 'double area = 3.14 * radius * radius;');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (2, 'std::string name = "John";');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (2, 'if (x > y) std::swap(x, y);');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (2, 'bool isEven = (num % 2 == 0);');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (2, 'std::map<std::string, int> score;');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (2, 'const int MAX_SIZE = 100;');

INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'import matplotlib.pyplot as plt');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'SVC(kernel="linear", C=0.025, random_state=42),');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'X += 2 * rng.uniform(size=X.shape)');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'figure = plt.figure(figsize=(27, 9))');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'cm_bright = ListedColormap(["#FF0000", "#0000FF"])');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'for name, clf in zip(names, classifiers):');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'score = clf.score(X_test, y_test)');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'clf = make_pipeline(StandardScaler(), clf)');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'lw_mse[i, j] = lw.error_norm(real_cov, scaling=False)');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'oa_shrinkage = np.zeros((n_samples_range.size, repeat))');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'plt.plot(X_test, y_1, color="cornflowerblue", label="max_depth=2", linewidth=2)');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'import matplotlib.pyplot as plt');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'y[::5, :] += 0.5 - rng.rand(20, 2)');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'X = np.sort(200 * rng.rand(100, 1) - 100, axis=0)');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (3, 'train_ax.scatter(X_train[:, 0], X_train[:, 1], c=y_train)');

INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (1, 'def factorial(n):\n\tif n == 0:\n\t\treturn 1\n\telse:\n\t\treturn n * factorial(n - 1)\nprint(factorial(5))');


INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (4, 'public static void main(String[] args)');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (4, 'List<String> names = new ArrayList<>(); names.add("Alice"); names.add("Bob");');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (4, 'public int factorial(int n) { return (n == 0) ? 1 : n * factorial(n - 1); }');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (4, 'Map<String, Integer> ages = new HashMap<>(); ages.put("Alice", 25);');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (4, 'interface Greeter { void greet(String name); }');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (4, 'String str = "Hello";');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (4, 'int[] numbers = {1, 2, 3, 4, 5}; int sum = Arrays.stream(numbers).sum();');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (4, 'LocalDate today = LocalDate.now(); LocalDate tomorrow = today.plusDays(1);');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (4, 'try { File file = new File("test.txt"); Scanner scanner = new Scanner(file); }');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (4, 'Stream.of("a", "b", "c").filter(s -> s.startsWith("a"));');


INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (5, 'fun main() { println("Hello, Kotlin!") }');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (5, 'val numbers = listOf(1, 2, 3, 4, 5); val even = numbers.filter { it % 2 == 0 }');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (5, 'class User(val name: String, val age: Int)');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (5, 'fun String.addExclamation() = this + "!"; println("Hello".addExclamation())');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (5, 'val map = mapOf("a" to 1, "b" to 2, "c" to 3); println(map["a"])');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (5, 'val nullableString: String? = null; val length = nullableString?.length ?: 0');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (5, 'fun <T> printList(items: List<T>) { items.forEach { println(it) } }');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (5, 'val sequence = sequence { yield(1); yieldAll(listOf(2, 3, 4)) }');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (5, 'val result = runCatching { "123".toInt() }.getOrElse { 0 }');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (5, 'val lazyValue: String by lazy { println("computed!"); "Hello" }');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (5, 'fun interface StringProcessor { fun process(value: String) }');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (5, 'val regex = "\\d+".toRegex(); val containsDigit = regex.containsMatchIn("abc")');


-- Коды для JavaScript (отдельные, несвязанные) - 10 примеров
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (6, 'const numbers = [1, 2, 3, 4, 5];');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (6, 'const squares = numbers.map(x => x * x);');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (6, 'const fetchData = async () => {};');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (6, 'const response = await fetch("https://api.example.com/data");');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (6, 'return response.json();');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (6, 'console.log(`Hello, ${this.name}!`);');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (6, 'const sum = (...args) => args.reduce((a, b) => a + b, 0);');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (6, 'const [first, ...rest] = [1, 2, 3, 4, 5];');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (6, 'const delay = ms => new Promise(resolve => setTimeout(resolve, ms));');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (6, 'const unique = [...new Set([1, 2, 2, 3, 4, 4, 5])];');
INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (6, 'const today = new Date().toISOString().split("T")[0];');
//
DELIMITER ;