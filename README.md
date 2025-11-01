# Visualizador-_de_busqueda
Visualizador interactivo de algoritmos de búsqueda (BFS, DFS, Greedy y A*) desarrollado con Flask y JavaScript. Permite observar en tiempo real el proceso de exploración y la ruta óptima encontrada por cada algoritmo.

# 🔍 Visualizador de Algoritmos de Búsqueda

Un proyecto interactivo que permite **visualizar y comparar el funcionamiento de distintos algoritmos de búsqueda** en tiempo real.  
Incluye implementaciones de **BFS**, **DFS**, **Greedy** y **A\***, utilizando **Flask** como backend y **HTML, CSS y JavaScript** para el frontend.

---

## 🚀 Características principales

- 🎯 Comparación visual entre BFS, DFS, Greedy y A*.
- 🧱 Creación de obstáculos (paredes) y borrado dinámico.
- ⚙️ Ajuste de velocidad de la animación.
- 🟢 Definición interactiva del punto de inicio y final.
- 💡 Interfaz moderna con modo oscuro y animaciones suaves.
- 🔄 Comunicación entre frontend y backend mediante peticiones **POST (fetch API)**.

---

## 🧠 Algoritmos implementados

| Algoritmo | Descripción breve |
|------------|-------------------|
| **BFS (Breadth-First Search)** | Busca el camino más corto en términos de pasos, explorando nivel por nivel. |
| **DFS (Depth-First Search)** | Explora lo más profundo posible antes de retroceder. No garantiza el camino más corto. |
| **Greedy Best-First Search** | Usa una heurística (distancia Manhattan) para elegir el nodo más prometedor. |
| **A\*** | Combina el costo recorrido y una heurística para encontrar la ruta óptima eficientemente. |

---

## ⚙️ Tecnologías utilizadas

### Backend
- **Python 3**
- **Flask**
- **Flask-CORS**
- **heapq**, **deque** (para estructuras de datos eficientes)

### Frontend
- **HTML5**
- **CSS3 (modo oscuro y responsive)**
- **JavaScript (ES6+)**

---

## Instalación y ejecución
