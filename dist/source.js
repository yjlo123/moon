/* Built on
Mon 3 Jan 2022 12:32:59 EST
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
 psh $_notes 'ls [<p>]-- list directory contents\\n'
 psh $_notes 'pwd -- return working directory name\\n'
 psh $_notes 'cd <d> -- change directory\\n'
 psh $_notes 'mkdir <d> -- make a directory\\n'
 psh $_notes 'cat <f> -- concatenate and print a file\\n'
 psh $_notes 'rm <f/d> -- remove a directory entry\\n'
 psh $_notes 'echo <s> -- output an argument\\n'
 psh $_notes '..[> <f>] -- write to a file\\n'
 psh $_notes '..[>> <f>] -- append to a file\\n'
 psh $_notes 'run <f> -- run an executable file\\n'
 psh $_notes 'edit <f> -- edit an executable file\\n'
 psh $_notes 'exit -- shut down system\\n'
 psh $_notes '---------------------------------------'
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
 
 let _count_p []
 psh $_count_p 'let n 5'
 psh $_count_p '#loop'
 psh $_count_p 'prt $n'
 psh $_count_p 'sub n $n 1'
 psh $_count_p 'slp 600'
 psh $_count_p 'jne $n 0 loop'
 put $_path_programs 'count' $_count_p

 let _age_p []
 psh $_age_p 'prt \\'Input year born:\\''
 psh $_age_p 'inp _year'
 psh $_age_p 'int _year $_year'
 psh $_age_p 'tim _current year'
 psh $_age_p 'sub age $_current $_year'
 psh $_age_p 'prt \\'Age:\\''
 psh $_age_p 'prt $age'
 put $_path_programs 'compute_age' $_age_p

 let _slow_print_p []
 psh $_slow_print_p 'let msg \\'Hello World!\\n\\''
 psh $_slow_print_p '#loop'
 psh $_slow_print_p 'pol $msg c'
 psh $_slow_print_p 'jeq $c \\'\\' done'
 psh $_slow_print_p 'slp 100'
 psh $_slow_print_p 'prt $c \\'\\''
 psh $_slow_print_p 'jmp loop'
 psh $_slow_print_p '#done'
 put $_path_programs 'slow_print' $_slow_print_p

 put $root 'programs' $_path_programs

 psh $path 'home'
end
prt 'Moon OS  v1.01'
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
 pol $tokens _path
 ife $_path $nil
  cal get_current_dir
 els
  cal get_dir_by_path_str $_path
 fin
 ife $ret $nil
  cal print_error 'Invalid path'
  jmp repl_loop
 fin

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
    let _i 1    / line number
    for _row $dr
     cal replace_char_in_str $_row '\\n' '\\\\n'
     let _row $ret
     add _ln $_i ' |'
     add _row $_ln $_row
     prt $_row
     add _i $_i 1
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

/ -- EDIT --
ife $cmd 'edit'
 pol $tokens file_name
 ife $file_name $nil
  cal print_error 'Invalid file name'
  jmp repl_loop
 fin
 cal get_current_dir
 let curr_dir $ret
 get $curr_dir $file_name fc

 / create file if not exist
 ife $fc $nil
  let file_content []
  put $curr_dir $file_name $file_content
  prt 'File created.'
 fin
 get $curr_dir $file_name fc

 / check file executable
 cal check_executable $fc
 ife $ret 1
  jmp edit_file_valid
 fin
 cal print_error 'Not an executable file'
 jmp repl_loop
 #edit_file_valid

 prt '== Edit v0.1'
 prt '== v:view a:append i:insert r:replace q:quit'
 prt '== File: ' ''
 prt $file_name

 #edit_loop
 prt '#' ''
 inp edit_in
 cal parse_input $edit_in
 let edit_tokens $ret
 pol $edit_tokens edit_cmd

 jeq $edit_cmd 'q' repl_loop   / quit
 ife $edit_cmd 'v'             / view
  get $curr_dir $file_name fc
  let _i 1    / line number
  for _row $fc
   cal replace_char_in_str $_row '\\n' '\\\\n'
   let _row $ret
   add _ln $_i ' |'
   add _row $_ln $_row
   prt $_row
   add _i $_i 1
  nxt
 fin
 ife $edit_cmd 'a'             / append
  pol $edit_tokens line_content
  get $curr_dir $file_name current_content
  cal replace_esc_in_str $line_content
  psh $current_content $ret
 fin
 ife $edit_cmd 'd'             / delete
  pol $edit_tokens line_number
  int line_number $line_number
  sub line_number $line_number 1
  get $curr_dir $file_name current_content
  let new_content []
  let _line_count 0
  for line $current_content
   ife $_line_count $line_number
    jmp _edit_delete_continue
   fin
   psh $new_content $line
   #_edit_delete_continue
   add _line_count $_line_count 1
  nxt
  put $curr_dir $file_name $new_content
 fin
 ife $edit_cmd 'i'              / insert
  pol $edit_tokens line_number
  int line_number $line_number
  sub line_number $line_number 1
  pol $edit_tokens line_content
  get $curr_dir $file_name current_content
  let new_content []
  let _line_count 0
  for line $current_content
   ife $_line_count $line_number
    cal replace_esc_in_str $line_content
    psh $new_content $ret
   fin
   psh $new_content $line
   add _line_count $_line_count 1
  nxt
  put $curr_dir $file_name $new_content
 fin
 ife $edit_cmd 'r'              / replace
  pol $edit_tokens line_number
  int line_number $line_number
  sub line_number $line_number 1
  pol $edit_tokens line_content
  get $curr_dir $file_name current_content
  let new_content []
  let _line_count 0
  for line $current_content
   ife $_line_count $line_number
   cal replace_esc_in_str $line_content
    psh $new_content $ret
   els
    psh $new_content $line
   fin
   add _line_count $_line_count 1
  nxt
  put $curr_dir $file_name $new_content
 fin
 / prt 'File updated.'
 jmp edit_loop
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
  get $_line 2 _val2
  ife $_val2 $nil
   prt $_val
  els
   cal expr $_val2
   prt $_val $ret
  fin
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
 ife $_cmd 'jmp'
  get $_line 1 _lbl_name
  get $_lbl $_lbl_name _pc
 fin
 ife $_cmd 'jeq'
  cal eval_param $_line 1
  let _v1 $ret
  cal eval_param $_line 2
  let _v2 $ret
  get $_line 3 _lbl_name
  jne $_v1 $_v2 jeq_false
  get $_lbl $_lbl_name _pc
  #jeq_false
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
 ife $_cmd 'inp'
  get $_line 1 _var
  inp _val
  put $env $_var $_val
 fin
 ife $_cmd 'int'
  get $_line 1 _var
  cal eval_param $_line 2
  int _val $ret
  put $env $_var $_val
 fin
 ife $_cmd 'tim'
  get $_line 1 _var
  get $_line 2 _time
  ife $_time 'year'
   tim _val year
  fin
  put $env $_var $_val
 fin
 ife $_cmd 'pol'
  cal eval_param $_line 1
  let _list $ret
  get $_line 2 _name
  pol $_list _first
  get $_line 1 _list_name
  pol $_list_name _
  put $env $_list_name $_list
  put $env $_name $_first
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

def split_str
 let _res []
 let _str $0
 let _delimiter $1
 let _current_token ''
 for _c $_str
  ife $_c $_delimiter
   jeq $_current_token '' split_str_token_skip
   psh $_res $_current_token
   let _current_token ''
   #split_str_token_skip
  els
   add _current_token $_current_token $_c
  fin
 nxt
 jeq $_current_token '' split_str_last_token_skip
 psh $_res $_current_token
 #split_str_last_token_skip
 ret $_res
end

def get_dir_by_path_str
 let _path_str $0    / assert non-empty
 get $_path_str 0 _path_first_c
 
 let _full_path []
 ife $_path_first_c '/'
  / absolute path
  let _full_path []
 els
  / relative path
  for _p $path
   psh $_full_path $_p
  nxt
 fin
 
 cal split_str $_path_str '/'
 let _path $ret

 for _p $_path
  psh $_full_path $_p
 nxt

 let _dup_full_path []
 for _p $_full_path
  psh $_dup_full_path $_p
 nxt
 cal verify_path $_dup_full_path
 ife $ret 0
  ret $nil
 fin

 let _curr_path $root
 for _d $_full_path
  get $_curr_path $_d _curr_path
 nxt
 ret $_curr_path
end

def verify_path
 let _path $0
 let _curr_path $root
 #verify_path_next
 pol $_path _p
 jeq $_p $nil verify_path_true
 get $_curr_path $_p _curr_path
 ife $_curr_path $nil
  ret 0
 fin
 jmp verify_path_next
 #verify_path_true
 ret 1
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

def replace_char_in_str
 let str $0
 let chr $1
 let to $2
 len $str str_len
 let new ''
 for i $str_len
  get $str $i c
  ife $c $chr
   add new $new $to
  els
   add new $new $c
  fin
 nxt
 ret $new
end

def replace_esc_in_str
 let str $0
 len $str str_len
 let new ''
 let escaping 0
 for i $str_len
  get $str $i c
  ife $c '\\\\'
   ife $escaping 0
    let escaping 1
   els
    add new $new $c
   fin
  els
   ife $escaping 1
    ife $c 'n'
     add new $new '\\n'
    fin
    let escaping 0
   els
    add new $new $c
   fin
  fin
 nxt
 ret $new
end
`
