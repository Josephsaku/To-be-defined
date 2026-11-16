import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

export function cleanupData(directory){
  const target=path.resolve(directory),root=path.resolve(os.tmpdir());
  if(path.dirname(target)!==root||!path.basename(target).startsWith('pending-confirmation-test-')){
    throw Error('Refusing to remove a directory outside this test’s temporary folder.');
  }
  fs.rmSync(target,{recursive:true,force:true});
}
