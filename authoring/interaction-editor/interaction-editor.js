function main() {
    createExercise();
}

// the exerciseManager holds the api to the new exercise
let exerciseManager;
main();

function createExercise() {
    let defaultOptions = {
        // defaultQuestionMode: 'ALL_AT_ONCE',
        // defaultEditor: 'equations',
        availableAudiences: [{
            name: 'English - Key Stage 5',
            id: 'uk_KS5',
            languages: ['en']
        }, {
            name: 'English - Key Stage 3',
            id: 'uk_KS3',
            languages: ['en']
        }]
    
    }

    // the exerciseManager represents the new exercise
    exerciseManager = AlgebraKIT._api.createExercise(defaultOptions);

    // Add a new (empty) interaction to the exercise. An exercise can contain multiple interactions.
    let questionIndex = 0;
    let interactionName = 'I1';
    let interactionSpec = exerciseManager.addInteraction(questionIndex,  interactionName);
    
    let exerciseId = exerciseManager.getExerciseId();
    let refId = interactionSpec.id;

    // the akit-interaction-editor Web Component displays a GUI to configure a single interaction in the exercise
    let container = document.getElementById('editor-container');
    container.innerHTML = `<akit-interaction-editor ref-id="${refId}" exercise-id="${exerciseId}"></akit-interaction-editor>`;
}


function run() {
    let spec = exerciseManager.getExercise();

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
                let editor = document.getElementsByTagName('akit-interaction-editor')[0];
                editor.setErrorData({
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

