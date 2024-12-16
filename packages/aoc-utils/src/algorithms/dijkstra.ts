import {
  IGetCompareValue,
  MinPriorityQueue,
} from "@datastructures-js/priority-queue";

export interface ShortestPathResult {
  /** Total cost of the shortest path */
  cost: number;

  /** A structure holding all possible vertices leading to destination */
  prev: Map<string, Set<string>>;
}

/**
 * An implementation of Dijkstra's algorithm using a priority queue. Vertices
 * must be uniquely identifiable by a string key.
 *
 * The `shortestPath` method returns path elements, not just a cost. See
 * **Discussion*.
 *
 * **Discussion**
 *
 * The `shortestPath` method returns the shortest path in order, not just a cost.
 *
 * > A more general problem is to find all the shortest paths between source and
 * > target (there might be several of the same length). Then instead of storing
 * > only a single node in each entry of prev[] all nodes satisfying the
 * > relaxation condition can be stored. For example, if both r and source
 * > connect to target and they lie on different shortest paths through target
 * > (because the edge cost is the same in both cases), then both r and source
 * > are added to prev[target]. When the algorithm completes, prev[] data
 * > structure describes a graph that is a subset of the original graph with
 * > some edges removed. Its key property is that if the algorithm was run with
 * > some starting node, then every path from that node to any other node in the
 * > new graph is the shortest path between those nodes graph, and all paths of
 * > that length from the original graph are present in the new graph. Then to
 * > actually find all these shortest paths between two given nodes, a path
 * > finding algorithm on the new graph, such as depth-first search would work.
 * > -- Wikipedia: https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
 */
export class Dijkstra {
  private readonly graph: Map<string, Map<string, number>>;

  constructor() {
    this.graph = new Map<string, Map<string, number>>();
  }

  addEdge(from: string, to: string, weight: number): void {
    if (!this.graph.has(from)) {
      this.graph.set(from, new Map<string, number>());
    }
    this.graph.get(from)!.set(to, weight);
  }

  /**
   * Returns the lowest-cost path from start to end, or `NaN` if no path is
   * found.
   */
  shortestPath(
    start: string,
    isEnd: (v: string) => boolean
  ): ShortestPathResult {
    const distances = new Map<string, number>();
    const pq = new MinPriorityQueue<PriorityQueueElement>(pqComparator);
    const visited = new Set<string>();

    const prev = new Map<string, Set<string>>();
    distances.set(start, 0);
    pq.enqueue({
      key: start,
      weight: 0,
    });

    while (!pq.isEmpty()) {
      const currentElement = pq.dequeue();

      if (visited.has(currentElement.key)) {
        continue;
      }

      visited.add(currentElement.key);

      if (isEnd(currentElement.key)) {
        const result = {
          cost: distances.get(currentElement.key) ?? 0,
          prev,
        };
        return result;
      }

      const neighbors = this.graph.get(currentElement.key);
      if (!neighbors) {
        continue;
      }

      for (const [neighbor, weight] of neighbors.entries()) {
        const distance = (distances.get(currentElement.key) ?? 0) + weight;

        if (
          !distances.has(neighbor) ||
          distance <= (distances.get(neighbor) ?? 0)
        ) {
          distances.set(neighbor, distance);
          if (!prev.has(neighbor)) {
            prev.set(neighbor, new Set<string>());
          }
          prev.get(neighbor)!.add(currentElement.key);

          pq.enqueue({
            key: neighbor,
            weight: distance,
          });
        }
      }
    }

    return {
      cost: NaN,
      prev,
    };
  }
}

interface PriorityQueueElement {
  key: string;
  weight: number;
}

const pqComparator: IGetCompareValue<PriorityQueueElement> = (
  a: PriorityQueueElement
): number => a.weight;
