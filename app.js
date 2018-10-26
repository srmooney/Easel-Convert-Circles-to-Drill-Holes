// Define a properties array that returns array of objects representing
// the accepted properties for your application
var properties = [
  {type: 'boolean', id: 'Replace Existing', value: false}
//  {type: 'range', id: "Height", value: 4, min: 1, max: 10, step: 1},
//  {type: 'range', id: "Radius", value: 0, min: 0, max: 10, step: 1}
];

var getSelectedVolumes = function(volumes, selectedVolumeIds){
  return volumes.filter(function(volume){
    return selectedVolumeIds.indexOf(volume.id) >= 0;
  });
};

// Define an executor function that builds an array of volumes,
// and passes it to the provided success callback, or invokes the failure
// callback if unable to do so
var executor = function(args, success, failure) {
  var params = args.params;
  var material = args.material;
  var bitSize = args.bitParams.bit.width;
  if (args.bitParams.bit.unit === 'mm') { bitSize /= 25.4; }
  
  var removeExisting = params['Replace Existing'];
  
  var newVolumes = [];
  var selectedVolumes = getSelectedVolumes(args.volumes, args.selectedVolumeIds);
  
  selectedVolumes.forEach(function(selectedVolume){
    console.log('selectedVolume', selectedVolume);
    /* */
    newVolumes.push({
      shape: {
          type: 'drill',
          center: {
            x: selectedVolume.shape.center.x,
            y: selectedVolume.shape.center.y
          },
          flipping: {},
          width: bitSize,
          height: bitSize,
          rotation: 0
      },
      cut: {
         type: 'drill',
         depth: selectedVolume.cut.depth,
         outlineStyle: 'on-path',
         tabPreference: false
      }
    });
    
    if (removeExisting){
      delete selectedVolume.shape;
      newVolumes.push({
        id: selectedVolume.id
      });
    }
   
  });

  //return failure('Not able to find points');
  return success(newVolumes);
};
