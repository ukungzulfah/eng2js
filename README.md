        
     __|           
     _|    \   _` |
    ___|_| _|\__, |
             ____/ 

# Eng2js
Javascript Engine Magic Quote Beta 1

## Installation
```html
<head>
	<script src="jquery.min.js"></script>
  <script src="eng2.js"></script>
</head>
```

## Basic Usage
Your Eng2js code write among controller html tag 
```html
<div controller>...</div>
```
### Hello Eng2js !
Bellow basic usage of hello world.
```html
<div controller init=" name='Eng2js' ">
   Hello my name is ^name
</div>
```
You will be get in browser bellow:

Hello my name is Eng2js

### Two-way Binding

```html
<div controller="ctrl"> 
  <label>Name: </label>
  <input type="text" model="name">
  <p>^name</p>
</div>
```
another way, we can use external script for initialize model binding. You will love it :)
```html
<div controller="ctrl"> 
    <label>Name: </label>
    <input type="text" model="name">
    <p>^name</p>
</div>

<script>
    eng.controller('ctrl', function(){
        this.name = 'Eng2js';
    });
</script>
```
