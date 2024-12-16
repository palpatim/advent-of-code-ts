import {
  IGetCompareValue,
  MinPriorityQueue,
} from "@datastructures-js/priority-queue";

/**
 * An implementation of Dijkstra's algorithm using a priority queue. Vertices
 * must be uniquely identifiable by a string key.
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
  shortestPath(start: string, isEnd: (v: string) => boolean): number {
    const distances = new Map<string, number>();
    const pq = new MinPriorityQueue<PriorityQueueElement>(pqComparator);
    const visited = new Set<string>();

    distances.set(start, 0);
    pq.enqueue([start, 0]);

    while (!pq.isEmpty()) {
      const current = pq.dequeue()[0];

      if (isEnd(current)) {
        return distances.get(current) ?? 0;
      }

      if (visited.has(current)) {
        continue;
      }

      visited.add(current);

      const neighbors = this.graph.get(current);
      if (!neighbors) {
        continue;
      }

      for (const [neighbor, weight] of neighbors.entries()) {
        const distance = (distances.get(current) ?? 0) + weight;

        if (
          !distances.has(neighbor) ||
          distance < (distances.get(neighbor) ?? 0)
        ) {
          distances.set(neighbor, distance);
          pq.enqueue([neighbor, distance]);
        }
      }
    }

    return NaN;
  }
}

/**
 * Priority queue elements are a tuple of [weight, id]
 */
type PriorityQueueElement = [string, number];

const pqComparator: IGetCompareValue<PriorityQueueElement> = (
  a: PriorityQueueElement
): number => a[1];
