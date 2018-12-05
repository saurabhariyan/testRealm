import React, { Component } from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import axios from 'axios';
import { EventsSchema, EVENTS_SCHEMA } from './allSchemas';
const Realm = require('realm');
const databaseOptions = {
  path: 'realmT4.realm',
  schema: [EventsSchema],
  schemaVersion: 0
};
type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = { events: null, size: 0, runTime: 0, findName: '', text: '', updateText: '' };
  }
  componentWillMount() {
    Realm.open(databaseOptions).then(realm => {
      this.setState({ size: realm.objects(EVENTS_SCHEMA).length });
    });
  }
  downloadEvents() {
    const startTime = new Date().getTime();
    axios.get('https://YourAPI/YourMethod')
      .then(response => {
        Realm.open(databaseOptions).then(realm => {
          realm.write(() => {
            response.data.forEach(obj => {
              if (realm.objects(EVENTS_SCHEMA).filtered(`EventID=${obj.EventID}`).length === 0) {
                realm.create(EVENTS_SCHEMA, obj);
              }
            });
            this.setState({ size: realm.objects(EVENTS_SCHEMA).length });
            const endTime = new Date().getTime();
            this.setState({ runTime: endTime - startTime });
          });
        });
      });
  }
  uploadEvents() {
  }
  clearAllEvents() {
    const startTime = new Date().getTime();
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          const allEvents = realm.objects(EVENTS_SCHEMA);
          realm.delete(allEvents); // Deletes all books
          this.setState({ size: realm.objects(EVENTS_SCHEMA).length });
          const endTime = new Date().getTime();
          this.setState({ runTime: endTime - startTime });
        })
      })
      .catch(error => {
      });
  }
  findID() {
    const startTime = new Date().getTime();
    const text = this.state.text;
    Realm.open(databaseOptions).then(realm => {
      const res = realm.objects(EVENTS_SCHEMA).filtered(`EventID=${text}`)
      this.setState({ findName: res[0].EventID + ': ' + res[0].EventName })
      const endTime = new Date().getTime();
      this.setState({ runTime: endTime - startTime });
    })
      .catch((error) => {
        console.log(error);
      });
  }
  findName() {
    const startTime = new Date().getTime();
    const text = this.state.text;
    Realm.open(databaseOptions).then(realm => {
      const res = realm.objects(EVENTS_SCHEMA).filtered(`EventName="${text}"`)
      this.setState({ findName: res[0].EventID + ': ' + res[0].EventName })
      const endTime = new Date().getTime();
      this.setState({ runTime: endTime - startTime });
    })
      .catch((error) => {
        console.log(error);
      });
  }
  updateName() {
    const startTime = new Date().getTime();
    const updateText = this.state.updateText;
    const text = this.state.text;
    Realm.open(databaseOptions).then(realm => {
      let target = realm.objects(EVENTS_SCHEMA).filtered(`EventID=${text}`)[0];
      if (!target) {
        target = realm.objects(EVENTS_SCHEMA).filtered(`EventName=${text}`)[0];
      }
      realm.write(() => {
        target.EventName = updateText;
      })
      const endTime = new Date().getTime();
      this.setState({ runTime: endTime - startTime });
    })
  }
  render() {
    const info = 'Number of items in this Realm: ' + this.state.size
    return (
      <View >
        <Text>
          {info}
        </Text>
        <Text>
          Execution time: {this.state.runTime} ms
        </Text>
        <Button onPress={this.downloadEvents.bind(this)} title="Download" />
        <Button onPress={this.uploadEvents.bind(this)} title="Upload" />
        <Button onPress={this.clearAllEvents.bind(this)} title="Delete All" />
        <TextInput
          onChangeText={(text) => this.setState({ text })}
          value={this.state.text}
        />
        <Button onPress={this.findID.bind(this)} title="Find by ID" />
        <Button onPress={this.findName.bind(this)} title="Find by Name" />
        <Text>
          Find user: {this.state.findName}
        </Text>
        <Text>
          Update above user name to:
        </Text>
        <TextInput
          onChangeText={(updateText) => this.setState({ updateText })}
          value={this.state.updateText}
        />
        <Button onPress={this.updateName.bind(this)} title="Update Name" />
      </View>
    );
  }
}




// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow
//  */

// import React, {Component} from 'react';
// import {Platform, StyleSheet, Text, View} from 'react-native';

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

// type Props = {};
// export default class App extends Component<Props> {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.welcome}>Welcome to React Native!</Text>
//         <Text style={styles.instructions}>To get started, edit App.js</Text>
//         <Text style={styles.instructions}>{instructions}</Text>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });
