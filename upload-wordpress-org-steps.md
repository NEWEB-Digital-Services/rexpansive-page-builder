# Upload to wordpress.org steps - 2021-08-26 - v0.0.1

0. Reference alla guida wordpress [https://developer.wordpress.org/plugins/wordpress-org/how-to-use-subversion/]
1. Comparare i file modificati dalla nuova versione con il comando `git diff %HASH_COMMIT_PARTENZA% %HASH_COMMIT_ARRIVO% --name-status`, dove gli hash rappresentano i commit di inizio e fine modifiche; questo produrrà una lista dei file modificati, assieme al tipo di modifica effettuata ((A)ggiunta, (M)odifica, (D)eliminazione)
   - con l'opzione `--name-only` è possibile visualizzare solamente il nome del file, eventualmente per recuperare velocemente la lista dei file da copiare
2. salvare eventulmente questa lista
3. usando la lista spostare solamente i file necessari (evitare package.json o gulpfile.js) nel repository del plugin per wordpress.org
4. andare nel repository
5. lanciare `svn up`
6. lanciare `svn stat`
7. controllare che i file modificati siano corretti
8. lanciare `svn ci -m "%MESSAGGIO_DI_COMMIT%"`
9. lanciare `svn cp trunk tags\%NUOVA_VERSIONE%`
10. lanciare `svn ci -m "tagging version %NUOVA_VERSIONE%"`
