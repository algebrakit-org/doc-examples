let authoringComponent;

// optional: push an existing exercise definition to the authoring component
const SPEC = {"audience":"uk_KS5","course":"89dc0678-35d1-43c9-bfb5-7c46a1fa5cb2","definition":{"type":"EXERCISE","audience":"uk_KS5","questionMode":"ALL_AT_ONCE","elements":[{"type":"QUESTION","mathRendering":"PREPROCESSED","id":"Q1","content":"<div data-ref-id=\"Tk4yE\" data-ref-name=\"Block 1\">Simplify `$$$x\\left(x+1\\right)-x^{2}$$`</div>","instructionType":"SCRIPT","resources":[],"interactions":[{"showHints":true,"palette":"equations","id":"TC3WO","name":"I1","ans":{"action":"CALCULATE","id":"$$\\verb|solution|$$","type":"ALGEBRA","defs":[{"def":"$$x\\left(x+1\\right)-x^{2}$$","score":1,"marks":0,"preconds":[],"decimals":-1}],"evalMode":"EQUIVALENT","hidden":false,"parameter":null,"buggyDefs":[],"alternatives":[],"answers":[],"accuracyMode":"EXACT","accuracyEnabled":null,"targetUnitConvert":true},"extendedInline":false,"contextHints":[],"steps":[]}]}],"exerciseContext":{"properties":{"x":[{"name":"x","type":"VARIABLE","latex":"x","args":null}]}}},"id":"b6c55633-96ca-4aa4-af39-74a572037920","majorVersion":0,"minorVersion":0,"type":"SPECIFICATION","subjectId":"e7c31b28-326a-4447-860b-78ffbb698d98"};

main();

async function main() {
    authoringComponent = document.getElementsByTagName('akit-exercise-editor')[0];

    if(SPEC) {
        await AlgebraKIT.waitUntilReady(authoringComponent);
        authoringComponent.updateExercise(SPEC);
    }
}

async function showSpec() {
    // read the exercise definition from the authoring component
    let spec = await authoringComponent.getExercise();
    alert(JSON.stringify(spec));
}

async function run() {
    let spec = await authoringComponent.getExercise();

    // call /session/create through the secure proxy (which adds the x-api-key header to the request)
    sendJSON('/algebrakit-secure/session/create', {
        exercises: [{
            exerciseSpec: spec
        }],
        'api-version': 2
    }).then(resp => {
        let outputElm = document.getElementById('test-container');
        if(resp && resp.length==1 &&  resp[0].sessions) {
            let session = resp[0].sessions[0];
            if(session.success) {
                //the given html is optimized such that no roundtrips to the server are required
                outputElm.innerHTML = session.html;
            } else if(session.errorData) {
                authoringComponent.setErrorData({
                    msg: session.msg,
                    data: session.errorData
                });

            } else {
                outputElm.innerHTML = 'An error occurred while trying to create the session'
            }
        }
    });
}

function sendJSON(url, data) {
    return new Promise((resolve, reject) => {
        var json = JSON.stringify(data);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                resolve(JSON.parse(xhr.responseText));
            }
        };

        xhr.send(json);
    });
}

