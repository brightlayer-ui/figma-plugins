import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { KEYS } from './shared';
import './ui.css';

declare function require(path: string): any;

const LOCAL_STORAGE_DATA = {};
onmessage = (event) => {
    LOCAL_STORAGE_DATA[event.data.pluginMessage.param] = event.data.pluginMessage.val;
};

const App: React.FC = () => {
    const [propertyName, setPropertyName] = React.useState('Theme');
    const [fromVariant, setFromVariant] = React.useState('Light');
    const [toVariant, setToVariant] = React.useState('Dark');

    // load stored parameters from history
    // use a timer to help picking up the async update from onmessage
    React.useEffect(() => {
        const timerPropertyName = setInterval(() => {
            if (LOCAL_STORAGE_DATA[KEYS.PROPERTY_NAME]) {
                setPropertyName(LOCAL_STORAGE_DATA[KEYS.PROPERTY_NAME]);
                clearInterval(timerPropertyName);
            }
        }, 50);
        const timerFromVariant = setInterval(() => {
            if (LOCAL_STORAGE_DATA[KEYS.FROM_VARIANT] !== undefined) {
                setFromVariant(LOCAL_STORAGE_DATA[KEYS.FROM_VARIANT]);
                clearInterval(timerFromVariant);
            }
        }, 50);
        const timerToVariant = setInterval(() => {
            if (LOCAL_STORAGE_DATA[KEYS.TO_VARIANT]) {
                setToVariant(LOCAL_STORAGE_DATA[KEYS.TO_VARIANT]);
                clearInterval(timerToVariant);
            }
        }, 50);
        return () => {
            clearInterval(timerPropertyName);
            clearInterval(timerFromVariant);
            clearInterval(timerToVariant);
        };
    }, []);

    return (
        <div>
            <div className={'input-row'}>
                <label>Property Name</label>
                <input
                    onChange={(e) => setPropertyName(e.target.value)}
                    name={'Name of the property shared by instances'}
                    value={propertyName}
                />
            </div>
            <div className={'input-row'}>
                <label>From Variant</label>{' '}
                <input
                    onChange={(e) => setFromVariant(e.target.value)}
                    name={'The variant name to change from'}
                    value={fromVariant}
                />
            </div>
            <div className={'input-row'}>
                <label>To Variant</label>
                <input
                    onChange={(e) => setToVariant(e.target.value)}
                    name={'The variant name to change into'}
                    value={toVariant}
                />
            </div>

            <div className={'button-row'}>
                <button
                    onClick={() => {
                        const temp = fromVariant;
                        setFromVariant(toVariant);
                        setToVariant(temp);
                    }}
                >
                    From <img src={require('./exchange.svg')} /> To
                </button>
                <button
                    className={'primary'}
                    onClick={() => {
                        parent.postMessage({ pluginMessage: { propertyName, fromVariant, toVariant } }, '*');
                    }}
                    disabled={propertyName === '' || toVariant === ''}
                >
                    Change Variant
                </button>
            </div>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('react-page'));
