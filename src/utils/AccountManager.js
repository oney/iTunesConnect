'use strict';

import React, {
  AsyncStorage,
} from 'react-native'

import Keychain from 'react-native-keychain'

const ACCOUNTS = 'ITUNES_CONNECT_ACCOUNTS'
const MAIN_ACCOUNT = 'ITUNES_CONNECT_MAIN_ACCOUNT'
const server = 'https://itunesconnect.apple.com/'

function credentialsServerName(account) {
  return `${server}${account}`
}

async function mainAccount() {
  try {
    return await AsyncStorage.getItem(MAIN_ACCOUNT)
  } catch (error) {
    console.warn('mainAccounts error: ', error.message)
    return null
  }
}
async function setMainAccount(account) {
  try {
    await AsyncStorage.setItem(MAIN_ACCOUNT, account)
  } catch (error) {
    console.warn('setMainAccounts error: ', error.message)
    throw error
  }
}
async function allAccounts() {
  try {
    let accounts = await AsyncStorage.getItem(ACCOUNTS)
    if (accounts === null){
      accounts = []
    } else {
      accounts = JSON.parse(accounts)
    }
    return accounts
  } catch (error) {
    console.warn('AsyncStorage error: ', error.message)
  }
}
async function store(account, password) {
  try {
    let accounts = await allAccounts()
    if (!accounts.includes(account)) {
      accounts.push(account)
    }
    await AsyncStorage.setItem(ACCOUNTS, JSON.stringify(accounts))
    if (password) {
      await Keychain.setInternetCredentials(credentialsServerName(account), account, password)
    } else {
      await Keychain.resetInternetCredentials(credentialsServerName(account))
    }
  } catch (error) {
    console.warn('AsyncStorage error: ', error.message)
    throw error
  }
}
async function passwordFor(account) {
  try {
    let credentials = await Keychain.getInternetCredentials(credentialsServerName(account))
    if (credentials && credentials.password) {
      return credentials.password
    }
    return null
  } catch (e) {
    return null
  }
}
function remove(account) {
}
async function clearAll() {
  try {
    await AsyncStorage.removeItem(MAIN_ACCOUNT)
    await AsyncStorage.removeItem(ACCOUNTS)
  } catch (error) {
    console.warn('setMainAccounts error: ', error.message)
    throw error
  }
}

export default {
  mainAccount,
  setMainAccount,
  allAccounts,
  store,
  passwordFor,
  remove,
  clearAll,
}
