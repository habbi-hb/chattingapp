/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Fragment } from 'react';
import {Text, SafeAreaView} from 'react-native';
import Nav from './src/navigation';
import Loader from "./src/component/loader";
import { StoreProvider } from './src/context/store';

const App = () =>  (
<StoreProvider>
    
<Nav />
<Loader />

</StoreProvider>

) ;




  
export default App;