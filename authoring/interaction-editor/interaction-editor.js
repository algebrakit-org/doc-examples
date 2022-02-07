function main() {
    createExercise();
}

// the exerciseManager holds the api to the new exercise
let exerciseManager;
const SPEC = null;    // the spec of an existing exercise
const REFID = 'ZyMTk' // the unique id of the interaction in the exercise that will be authored

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

    let refId;      // unique reference to the interaction in the exericse
    let exerciseId; // UUID of the exercise

    // the exerciseManager represents the exercise
    if(SPEC){
        // load an existing exercise
        exerciseManager = AlgebraKIT.setExercise(SPEC, defaultOptions);
        exerciseId = SPEC.id;
        refId = REFID;
    } else {
        // create a new exercise and add an (empty) interaction
        exerciseManager = AlgebraKIT.createExercise(defaultOptions);
        let questionIndex = 0;
        let interactionName = 'I1';
        let interactionSpec = exerciseManager.addInteraction(questionIndex,  interactionName);
        exerciseId = exerciseManager.getExerciseId();
        refId = interactionSpec.id;
    }

    // the akit-interaction-editor Web Component displays a GUI to configure a single interaction in the exercise
    let container = document.getElementById('editor-container');
    container.innerHTML = `<akit-interaction-editor ref-id="${refId}" exercise-id="${exerciseId}"></akit-interaction-editor>`;
}


function run() {
    let spec = exerciseManager.getExercise();
    console.log(spec);
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
                    exerciseManager.setDebugInfo(session.debugInformation);
                }
            } else if(session.errorData) {
                // the exercise contains some authoring error. Communicate the error data to the authoring 
                // component such that a meaningful error message can be shown.
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

