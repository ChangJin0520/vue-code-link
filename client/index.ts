function sendPath(filePath: string) {
    const protocol = window.location.protocol || 'http:';
    const hostname = window.location.hostname || 'localhost';
    const port = window.location.port || '80';

    const url = `${protocol}//${hostname}:${port}/vue-code-link?filePath=${filePath}`;

    fetch(url)
        .catch((error) => {
            console.log(error);
        });
}

function getFilePath(element: any): any {
    if (!element || !element.getAttribute) return null;

    if (element.getAttribute('c-loc')) {
        return element.getAttribute('c-loc');
    }

    return getFilePath(element.parentNode);
}

function openFileInEditor(e: MouseEvent) {
    e.preventDefault();

    const filePath = getFilePath(e.target);

    if (!filePath) return;

    sendPath(filePath);
}

function init() {
    document.onmousedown = function (e) {
        if (e.shiftKey && e.button === 0) {
            const element = document.createElement('div');
            const elementId = `click-ball${Date.now()}`;

            element.id = elementId;
            element.style.left = (e.clientX - 20) + "px";
            element.style.top = (e.clientY - 20) + "px";
            element.setAttribute("class", "click-ball hide-slow");
            document.body.appendChild(element);

            setTimeout(() => {
                document.getElementById(elementId) && document.getElementById(elementId)!.remove();
            }, 1000)

            openFileInEditor(e)
        }
    }
}
