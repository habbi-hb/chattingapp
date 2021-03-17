import AsyncStroage from '@react-native-community/async-storage';

export const keys ={
    uuid: 'uuid',
};

const setAsyncStroge = async(key, item) => {
    try
    {
        await AsyncStroage.setItem(key, item);
    } catch (error) {
        console.log(error);
    }
}

const getAsyncStroge = async(key) => {
    try
    {
      const value =  await AsyncStroage.getItem(key);
        if (value)
        {
            return value
        } else {
            return null
        }
     } catch (error) {
        console.log(error);
        return null;
    }
}
const clearAsyncStroage = async () => {
    try{
        await AsyncStroage.clear();

    }catch (error){
        console.log(error);
    }
}

export {setAsyncStroge, getAsyncStroge, clearAsyncStroage};