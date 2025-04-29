export function isDescendant(parent: HTMLElement, child: HTMLElement): boolean {
    if (!parent || !child) {
        return false;
    }

    let currentNode: Node | null = child;

    while (currentNode) {
        if (currentNode === parent) {
            return true;
        }
        currentNode = currentNode.parentNode;
    }

    return false;
}
