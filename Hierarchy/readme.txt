Questa cartella contiene classi Java. Quando queste classi sono eseguite con il nome d3js10anni.csv come parametro su riga di comando, producono su STDOUT un json in forma gerarchica darivato da tale file csv. Ciascuna classe Java produce un output diverso a partire dal csv, a seconda di come è stata programmata. Per ottenere file json, è necessario usare il reindirizzamento di STDOUT in un file, usando la sintassi "> output.json". Questo è utile per la riproducibilità del progetto.

La cartella contiene comunque già i file prodotti da ciascuna classe Java, ad esempio mapSF.json è stato prodotto tramite reindirizzamento di STDOUT della classe TreeScriptMap.class. Pertanto il comando shell completo per generare tale file è stato:

java TreeScriptMap d3js10anni.csv > mapSF.json

Questa parte del progetto è stata eseguita tramite Shell Ubuntu fornita tramite Windows Subsystem for Linux (WSL) su sistema operativo Windows 10.