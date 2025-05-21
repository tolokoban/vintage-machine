La mémoire de TLK-74 est comme une immense salle avec une infinité de tiroirs.
On peut mettre des choses dans ces tiroirs et les récupérer plus tard.

__Attention !__
Quand un programme BASIK commence, tous les tiroirs sont vides.
Et quand il se termime, tous les tiroirs sont vidés.

Pour accéder à ces tiroirs, on utilise ce qu'on appelle des __variables__.

Les variables sont des mots qui commencent par un dollar (`$`).
Elles servent à mémoriser des __valeurs__.
Une valeur est soit un __nombre__, soit du __texte__, soit une __liste de valeurs__.

```ts
REM On redémarre TLK-74
RESET()
REM assigner la variable
$age_de_zeus = 3950
REM lire la variable
PRINTLN($age_de_zeus)
```

Dans l'exemple ci-dessus, on commence par __assigner__ 3950 à la variable `$age_de_zeus`.
Ça veut dire qu'on va mettre le nombre 3950 dans un tiroir de la mémoire de TLK-74,
et que ce tiroir va s'appeler `$age_de_zeus`.
On peut donner le nom que l'on veut, mais en utilisant uniquement des lettres,
des chiffres et le blanc souligné (`_`).

Ensuite, quand TLK-74 verra cette variable, il va lire ce qu'il y a dans le tiroir du même nom.

Tu peux modifier ce qu'il y a dans une variable à tout moment.
Et même utiliser la valeur de la variable pour ça, comme dans cet exemple :

```ts
RESET()
$compte = 5
PRINTLN($compte)
$compte = $compte -1 
PRINTLN($compte)
$compte = $compte -1 
PRINTLN($compte)
$compte = $compte -1 
PRINTLN($compte)
$compte = $compte -1 
PRINTLN($compte)
$compte = $compte -1 
PRINTLN($compte)
PRINTLN("Partez !")
```

L'instruction `$compte = $compte - 1` veut dire : _tu lis la variable $compte, tu lui soustrais 1 et tu mets le résultat dans $compte_.

> Tu a parlé de listes au début.
> C'est quoi ?

Ça va te permettre d'organiser ta mémoire, mais on y reviendra dans un autre chapitre.
