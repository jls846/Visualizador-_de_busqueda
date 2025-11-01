from flask import Flask, request, jsonify
from collections import deque
import heapq
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# --- Funciones auxiliares ---
def get_neighbors(grid, pos):
    r, c = pos
    neighbors = []
    directions = [(-1,0), (1,0), (0,-1), (0,1)]
    for dr, dc in directions:
        nr, nc = r + dr, c + dc
        if 0 <= nr < len(grid) and 0 <= nc < len(grid[0]) and grid[nr][nc] == 0:
            neighbors.append((nr, nc))
    return neighbors

def heuristic(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

# --- BFS ---
@app.route('/bfs', methods=['POST'])
def bfs_route():
    data = request.json
    grid = data['grid']
    start = tuple(data['start'])
    end = tuple(data['end'])

    queue = deque([start])
    visited = set([start])
    came_from = {}
    exploration_order = [start]

    while queue:
        current = queue.popleft()
        if current == end:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.reverse()
            return jsonify({'path': path, 'visited': exploration_order})

        for neighbor in get_neighbors(grid, current):
            if neighbor not in visited:
                visited.add(neighbor)
                came_from[neighbor] = current
                queue.append(neighbor)
                exploration_order.append(neighbor)

    return jsonify({'path': [], 'visited': exploration_order})

# --- A* ---
@app.route('/astar', methods=['POST'])
def astar_route():
    data = request.json
    grid = data['grid']
    start = tuple(data['start'])
    end = tuple(data['end'])

    open_set = [(heuristic(start, end), start)]
    g_score = {start: 0}
    came_from = {}
    visited_order = []
    closed_set = set()

    while open_set:
        _, current = heapq.heappop(open_set)
        if current in closed_set:
            continue
        closed_set.add(current)
        visited_order.append(current)

        if current == end:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.reverse()
            return jsonify({'path': path, 'visited': visited_order})

        for neighbor in get_neighbors(grid, current):
            tentative_g = g_score.get(current, float('inf')) + 1
            if tentative_g < g_score.get(neighbor, float('inf')):
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g
                f_score = tentative_g + heuristic(neighbor, end)
                if neighbor not in closed_set:
                    heapq.heappush(open_set, (f_score, neighbor))

    return jsonify({'path': [], 'visited': visited_order})

@app.route('/dfs', methods=['POST'])
def dfs_route():
    data = request.json
    grid = data['grid']
    start = tuple(data['start'])
    end = tuple(data['end'])

    stack = [start]
    visited = set([start])
    came_from = {}
    exploration_order = [start]

    while stack:
        current = stack.pop()
        if current == end:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.reverse()
            return jsonify({'path': path, 'visited': exploration_order})

        for neighbor in reversed(get_neighbors(grid, current)):
            if neighbor not in visited:
                visited.add(neighbor)
                came_from[neighbor] = current
                stack.append(neighbor)
                exploration_order.append(neighbor)

    return jsonify({'path': [], 'visited': exploration_order})




@app.route('/greedy', methods=['POST'])
def greedy_route():
    data = request.json
    grid = data['grid']
    start = tuple(data['start'])
    end = tuple(data['end'])

    open_set = [(heuristic(start, end), start)]
    visited_order = []
    came_from = {}
    closed_set = set()

    while open_set:
        _, current = heapq.heappop(open_set)
        if current in closed_set:
            continue
        closed_set.add(current)
        visited_order.append(current)

        if current == end:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.reverse()
            return jsonify({'path': path, 'visited': visited_order})

        for neighbor in get_neighbors(grid, current):
            if neighbor not in closed_set:
                came_from[neighbor] = current
                heapq.heappush(open_set, (heuristic(neighbor, end), neighbor))

    return jsonify({'path': [], 'visited': visited_order})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
