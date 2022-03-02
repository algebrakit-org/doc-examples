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
    let previewContainer = document.getElementById('preview-container');
    previewContainer.innerHTML = `<akit-exercise-preview exercise-id="${exerciseId}"></akit-exercise-preview>`;
}


