let authoringComponent;

// optional: push an existing exercise definition to the authoring component
const SPEC = null;

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
        options: {
            // let AlgebraKIT automatically infer symbol types (e.g. 'km' is a unit, 'x' is a variable)
            generateDebugInfo: true
        },
        'api-version': 2
    }).then(resp => {
        let outputElm = document.getElementById('test-container');
        if(resp && resp.length==1 &&  resp[0].sessions) {
            let session = resp[0].sessions[0];
            if(session.success) {
                //the given html is optimized such that no roundtrips to the server are required
                outputElm.innerHTML = session.html;
                
                if(session.debugInformation) {
                    //AlgebraKiT generated information to help authoring. E.g. automatically set symbol types.
                    //Communicate this information to the authoring component.
                    authoringComponent.setDebugInfo(session.debugInformation);
                }
            } else if(session.errorData) {
                // the exercise contains some authoring error. Communicate the error data to the authoring 
                // component such that a meaningful error message can be shown.
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

