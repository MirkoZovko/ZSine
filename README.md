# ZSine
ZSine is small vanilla js library for creating multiple sine animations with different parameters.
It's the first version (0.0.1) and there is still lots of stuff to do there so I’ll explain it better in next versin when I do some more modifications on it and make it much better. But if you want to modify it by yourself you can get it here, or if you have some suggestions for me feel free to send me.

### Usage example

```html
<canvas class="waves"></canvas>
<script src="../lib/zsine.js"></script>
```

```javascript
    var effect1 = new ZSine({
        width: 50,
        height: 310,
        selector: ".effect1",		
        speed: 1,
        backgroundColor: "transparent",
        waves:[
            {
                step: 1,
                frequency: 15,	
                amplitude: 6,	
                amplitudeType: "lowIn-highOut",				
                colorGradient: [
                    {offset:0, color: "rgba(0, 0, 0, 0)"},
                    {offset:0.1, color: "rgba(255, 255, 255, 0.1)"},
                    {offset:0.5, color: "rgba(255, 255, 255, 0.2)"},
                    {offset:0.8, color: "rgba(255, 255, 255, 0.1)"},
                    {offset:1, color: "rgba(0, 0, 0, 0)"},
                ],
                width: 8,
                plotLine: "y"
            }
        ]
});
```

### For a ZSine showcase I crated multiple lighsaber animation effects:
  - [Lightsabers animation effects][demo1]
  - [Lightsaber animation effects builder][demo2]

I also wrote small artcile about this, you can read it [here][article].


## Future development
As I already mention, this is first version of the library. Very soon I'm planing to do some modifications and optimization on it, and make it much better.

  - Add new functionalities like: multiple dots for animation, more effects..etc
  - Add proper documentation how to use it
  - More examples, not only [lightsabers][demo1]

License
----
MIT


[demo1]: <https://codeorum.com/zsine/lightsaber>
[demo2]: <https://codeorum.com/zsine/lightsaber-builder>
[article]: <https://codeorum.com/tutorials/lightsaber-animation-effects-with-zsine-library-and-css>
