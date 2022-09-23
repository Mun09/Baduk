export function bfs(graph, startnode) {
    // grpah includes startnode
    const rows = 19, cols = 19;
    const color = graph[startnode[0]][startnode[1]];
    const arr1 = [1, -1, 0, 0], arr2 = [0, 0, 1, -1];
    const visited = [];
    let search_node = [];
    var death = true;

    search_node.push(startnode);

    while(search_node.length !== 0) {
        const node = search_node.shift();
        if(visited.find(i => JSON.stringify(i) === JSON.stringify(node)) === undefined) {
            visited.push(node);
            
            for(var i = 0; i < 4; i++) {
                var x = node[0] + arr1[i], y = node[1] + arr2[i];
                if(1 <= x && x <= cols && 1 <= y && y <= rows) {
                    if(graph[x][y] === -1) {
                        death = false;
                    } else if (graph[x][y] === color) {
                        search_node.push([x, y]);
                    }
                }
            }

        }
    }

    return [death, visited];
}