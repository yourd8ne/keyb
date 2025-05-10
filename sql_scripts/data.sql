-- Языки, словари, коды..
DELIMITER //
INSERT INTO Languages (Name, HighlightName) VALUES ('Python', 'python');
INSERT INTO Languages (Name, HighlightName) VALUES ('C++', 'cpp');

INSERT INTO Dictionaries (Name, Languages_idLanguage, NumberOfCodesForStudent) VALUES ('simplePythonClass', 1, 1);
INSERT INTO Dictionaries (Name, Languages_idLanguage, NumberOfCodesForStudent) VALUES ('baseCppCodes', 2, 10);
INSERT INTO Dictionaries (Name, Languages_idLanguage, NumberOfCodesForStudent) VALUES ('sklearnExamples', 1, 15);

INSERT INTO Dictionary_Codes (Dictionaries_idDictionary, Code) VALUES (1, 'def greet(name):\n\treturn f"Hello, {name}!"\n\nprint(greet("World"))');

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
//
DELIMITER ;