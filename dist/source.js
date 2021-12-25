/* Built on
Sat 25 Dec 2021 17:08:04 EST
*/
let moonSrc = `

let root {}
let path []

def init_files
 let root {}
 let path []

 / :/home
 let _path_home {}
 let _notes ''
 psh $_notes '----------- Moon OS Manual ------------\\n'
 psh $_notes 'ls -- list directory contents\\n'
 psh $_notes 'pwd -- return working directory name\\n'
 psh $_notes 'cd <d> -- change directory\\n'
 psh $_notes 'mkdir <d> -- make a directory\\n'
 psh $_notes 'cat <f> -- concatenate and print a file\\n'
 psh $_notes 'rm <f/d> -- remove a directory entry\\n'
 psh $_notes 'echo <s> -- output an argument\\n'
 psh $_notes '  ~ > <f> -- write to a file\\n'
 psh $_notes '  ~ >> <f> -- append to a file\\n'
 psh $_notes 'run <f> -- run an executable file\\n'
 psh $_notes 'exit -- shut down system\\n'
 psh $_notes '---------------------------------------\\n'
 put $_path_home 'note' $_notes
 let _misc {}
 put $_misc 'test' 'Hello World!'
 put $_path_home 'misc' $_misc
 put $root 'home' $_path_home

 / :/programs
 let _path_programs {}
 let _hello_p []
 psh $_hello_p 'prt \\'Hello!\\''
 psh $_hello_p 'slp 500'
 psh $_hello_p 'prt \\'Bye~\\''
 put $_path_programs 'hello' $_hello_p
 put $root 'programs' $_path_programs
 
 let _count_p []
 psh $_count_p 'let n 5'
 psh $_count_p '#loop'
 psh $_count_p 'prt $n'
 psh $_count_p 'sub n $n 1'
 psh $_count_p 'slp 600'
 psh $_count_p 'jne $n 0 loop'
 put $_path_programs 'count' $_count_p
 put $root 'programs' $_path_programs

 psh $path 'home'
end
prt 'Moon OS  v1.0'
prt 'Copyright (c) 1992 RunTech, Inc.'
prt 'All rights reserved.'
prt ''
prt 'Welcome'

cal init_files

#repl_loop
prt '>' ''
inp in
cal parse_input $in
let tokens $ret
pol $tokens cmd

jeq $cmd 'exit' exit
/ -- PWD --
ife $cmd 'pwd'
 cal get_current_path_str
 prt $ret
 jmp repl_loop
fin
/ -- LS --
ife $cmd 'ls'
 cal get_current_dir
 let dir $ret
 key $dir files
 for f $files
  get $dir $f fc 
  typ ft $fc
  ife $ft 'str'
   prt '<TXT> ' ''
  fin
  ife $ft 'list'
   prt '<EXE> ' ''
  fin
  ife $ft 'map'
   prt '<DIR> ' ''
  fin
  prt $f
 nxt
 jmp repl_loop
fin
/ -- CD --
ife $cmd 'cd'
 pol $tokens d
 ife $d $nil
  cal print_error 'invalid directory name'
  jmp repl_loop
 fin
 ife $d '..'
  pop $path _
  jmp repl_loop
 els
  ife $d '../'
   pop $path _
   jmp repl_loop
  fin
  cal get_current_dir
  get $ret $d dr
  ife $dr $nil
   cal print_error 'Directory not found'
   jmp repl_loop
  fin
  typ dr_typ $dr
  ife $dr_typ 'map'
   psh $path $d
   jmp repl_loop
  els
   cal print_error 'Not a directory'
  fin
 fin
 jmp repl_loop
fin
/ -- MKDIR --
ife $cmd 'mkdir'
 pol $tokens d
 ife $d $nil
  cal print_error 'Invalid directory name'
  jmp repl_loop
 fin
 cal get_current_dir
 let curr_dir $ret
 get $curr_dir $d dr
 ife $dr $nil
  put $curr_dir $d {}
 els
  cal print_error 'Directory/file exists'
 fin
 jmp repl_loop
fin
/ -- CAT --
ife $cmd 'cat'
 pol $tokens d
 ife $d $nil
  cal print_error 'Invalid file name'
  jmp repl_loop
 fin
 cal get_current_dir
 let curr_dir $ret
 get $curr_dir $d dr
 ife $dr $nil
  cal print_error 'File not found'
 els
  cal check_is_dir $dr
  ife $ret 1
   cal print_error 'Not a file'
  els
   typ file_type $dr
   let cat_success 0
   ife $file_type 'str'
    prt $dr
    let cat_success 1
   fin
   ife $file_type 'list'
    for _row $dr
     prt $_row
    nxt
    let cat_success 1
   fin
   ife $cat_success 0
    cal print_error 'Unsupported file type.'
   fin
  fin
 fin
 jmp repl_loop
fin
/ -- RUN --
ife $cmd 'run'
 pol $tokens d
 ife $d $nil
  cal print_error 'Invalid file name'
  jmp repl_loop
 fin
 cal get_current_dir
 let curr_dir $ret
 get $curr_dir $d dr
 ife $dr $nil
  cal print_error 'File not found'
 els
  cal check_executable $dr
  ife $ret 1
   cal runtime $dr
  els
   cal print_error 'File not executable'
  fin
 fin
 jmp repl_loop
fin
/ -- RM --
ife $cmd 'rm'
 pol $tokens d
 ife $d $nil
  cal print_error 'Invalid file/directory name'
  jmp repl_loop
 fin
 cal get_current_dir
 let curr_dir $ret
 get $curr_dir $d dr
 ife $dr $nil
  cal print_error 'File/directory not found'
 els
  del $curr_dir $d
 fin
 jmp repl_loop
fin
/ -- ECHO --
ife $cmd 'echo'
 pol $tokens s
 ife $s $nil
  let s ''
 fin
 pol $tokens p
 ife $p $nil
  prt $s
 fin
 ife $p '>'
  / write to file
  pol $tokens f
  ife $f $nil
   cal print_error 'Parse error'
  els
   cal get_current_dir
   let curr_dir $ret
   get $curr_dir $f fd
   ife $fd $nil
    put $curr_dir $f $s
   els
    prt 'File/directory exists, overwrite? Y/n'
    inp ans
    jeq $ans 'y' overwrite
    jeq $ans 'Y' overwrite
    jeq $ans '' overwrite
    jmp skip_ow
    #overwrite
    put $curr_dir $f $s
    #skip_ow
   fin
  fin
 fin
 ife $p '>>'
  / append to file
  pol $tokens f
  ife $f $nil
   cal print_error 'Parse error'
   jmp repl_loop
  els
   cal get_current_dir
   let curr_dir $ret
   get $curr_dir $f fc
   ife $fc $nil
    put $curr_dir $f $s
   els
    cal check_executable $fc
    ife $ret 1
     cal print_error 'Cannot write to an executable file'
    els
     add fc $fc '\\n'
     add fc $fc $s
     put $curr_dir $f $fc
    fin
   fin
  fin
 fin
 jmp repl_loop
fin
/ -- SAVE --
ife $cmd 'save'
 sav 'moon.sav' $root
 prt '[Saved]'
 jmp repl_loop
fin
/ -- LOAD --
ife $cmd 'load'
 lod 'moon.sav' loaded_data
 ife $loaded_data $nil
  cal print_error 'There is no saved data'
 els
  let root $loaded_data
  prt '[Loaded]'
 fin
 jmp repl_loop
fin
ife $cmd $nil
 jmp repl_loop
fin
add err_msg 'Unknown command: ' $cmd
cal print_error $err_msg
jmp repl_loop

#exit
prt 'Shutting down...'
/ ====== parsing runtime program ======
def parse_line
 let _line $0
 let _tokens []
 #next_token
 let _token ''
 #parse_token
 pol $_line _c
 jeq $_c '' parse_done
 jeq $_c ' ' token_done
 jeq $_c '\\'' parse_string
 jeq $_c '"' parse_string
 jmp add_token_char
 
 #parse_string
 let _q $_c
 let _s '\\''

 #parse_string_char
 pol $_line _c
 ife $_c $_q
  psh $_s $_c
  psh $_tokens $_s
  jmp next_token
 els
  psh $_s $_c
  jmp parse_string_char
 fin
 
 #add_token_char
 add _token $_token $_c
 jmp parse_token

 #token_done
 ife $_token ''
  jmp next_token
 els
  psh $_tokens $_token
 fin
 jmp next_token
 #parse_done
 ife $_token ''
  ret $_tokens
 fin
 psh $_tokens $_token
 ret $_tokens
end

def parse
 let _src $0
 let _p $1  / map ref
 let _lbl $2  / map ref
 let _lc 0
 for _line $_src
  / check label
  pol $_line _c1
  ife $_c1 '#'
   put $_lbl $_line $_lc
  fin
  add _line $_c1 $_line
  cal parse_line $_line
  put $_p $_lc $ret
  add _lc $_lc 1
 nxt
 ret $_p
end

/ ====== parsing user input ======
def parse_input
 let _input $0
 let _tokens []
 #next_token
 let _token ''
 #parse_token
 pol $_input _c
 jeq $_c '' parse_done
 jeq $_c ' ' token_done
 jeq $_c '\\'' parse_string
 jeq $_c '"' parse_string
 jmp add_token_char
 
 #parse_string
 let _q $_c
 let _s ''
 #parse_string_char
 pol $_input _c
 ife $_c $_q
  psh $_tokens $_s
  jmp next_token
 els
  psh $_s $_c
  jmp parse_string_char
 fin
 
 #add_token_char
 add _token $_token $_c
 jmp parse_token
 #token_done
 ife $_token ''
  jmp next_token
 els
  psh $_tokens $_token
 fin
 jmp next_token
 #parse_done
 ife $_token ''
  ret $_tokens
 fin
 psh $_tokens $_token
 ret $_tokens
end
let env {}

/ ====== evaluating ======
def expr
 let _expr $0
 let _original $0
 int _i $_expr
 jeq $_i $nil continue
 ret $_i
 #continue
 pol $_expr _c1
 ife $_c1 '$'
  get $env $_expr _val
  ret $_val
 fin
 ife $_c1 '\\''
  pop $_expr _
  ret $_expr
 fin
 ife $_c1 '['
  ret []
 fin
 ret $_original
end

def eval_param
 let _line $0
 let _idx $1
 get $_line $_idx _val
 cal expr $_val
 ret $ret
end

/ ** main eval **
def runtime
 let _src $0
 let env {}
 let _p {}
 let _lbl {}
 cal parse $_src $_p $_lbl
 let _pc 0
 
 #eval
 get $_p $_pc _line
 jeq $_line $nil eval_done
 get $_line 0 _cmd
 
 ife $_cmd 'clr'
  clr
 fin
 ife $_cmd 'prt'
  get $_line 1 _val
  cal expr $_val
  let _val $ret
  prt $_val
 fin
 ife $_cmd 'let'
  get $_line 1 _var
  cal eval_param $_line 2
  put $env $_var $ret
 fin
 jeq $_cmd 'add' do_arithmetic
 jeq $_cmd 'sub' do_arithmetic
 jeq $_cmd 'mul' do_arithmetic
 jeq $_cmd 'div' do_arithmetic
 jmp non_arithmetic
  #do_arithmetic
  get $_line 1 _var
  cal eval_param $_line 2
  let _val1 $ret
  cal eval_param $_line 3
  let _val2 $ret
  ife $_cmd 'add'
   add _res $_val1 $_val2
  fin
  ife $_cmd 'sub'
   sub _res $_val1 $_val2
  fin
  ife $_cmd 'mul'
   mul _res $_val1 $_val2
  fin
  ife $_cmd 'div'
   div _res $_val1 $_val2
  fin
  put $env $_var $_res
 #non_arithmetic
 ife $_cmd 'slp'
  cal eval_param $_line 1
  slp $ret
 fin
 ife $_cmd 'drw'
  cal eval_param $_line 1
  let _x $ret
  cal eval_param $_line 2
  let _y $ret
  cal eval_param $_line 3
  drw $_x $_y $ret
 fin
 ife $_cmd 'jne'
  cal eval_param $_line 1
  let _v1 $ret
  cal eval_param $_line 2
  let _v2 $ret
  get $_line 3 _lbl_name
  jeq $_v1 $_v2 jne_false
  get $_lbl $_lbl_name _pc
  #jne_false
 fin
 add _pc $_pc 1
 jmp eval
 
 #eval_done
end
def get_current_path_str
 let _path '/'
 for _d $path
  add _path $_path $_d
  add _path $_path '/'
 nxt
 ret $_path
end

def get_current_dir
 let _curr_path $root
 for _d $path
  get $_curr_path $_d _curr_path
 nxt
 ret $_curr_path
end

def check_executable
 let _file $0
 typ file_type $_file
 ife $file_type 'list'
  ret 1
 fin
 ret 0
end

def check_is_dir
 let _file $0
 typ file_type $_file
 ife $file_type 'map'
  ret 1
 fin
 ret 0
end

def print_error
 let _msg $0
 add _msg 'ERR ' $_msg
 prt $_msg
end
`
