/* Built on Mon May 29 20:35:14 EDT 2023 */
let moonSrc = `
/Moon OS (pro)
let os_name 'Moon OS'
let os_ver '1.25'
let os_flavor ''
let os_build 'N/A'

ife $os_host $nil
 let os_host 'unknown'
fin

let init_cmd '/programs/motd'

let root {}
let path []
let env_path ''
let env_prompt ''
let env_user ''

tim boot_time now

def init_files
 let root {}
 let path []
 let env_path '/env/path'
 let env_prompt '/env/prompt'
 let env_user '/env/user'

 / /env
 let _env_dir {}
 put $_env_dir 'path' '/programs'
 put $_env_dir 'prompt' '$p \\'#\\''
 put $_env_dir 'user' 'guest'
 put $root 'env' $_env_dir
end

def get_autocomplete
 let _keyword $0
 let _is_prog $1
 ife $_is_prog 1
  cal get_env_path
  let _cur_path $ret
  psh $_cur_path $_keyword
 els
  cal get_path_by_str $_keyword
  let _cur_path $ret
 fin
 pop $_keyword _last_char
 ife $_last_char '/'
  let _name ''
 els
  psh $_keyword $_last_char
  pop $_cur_path _name
 fin
 cal get_real_path $_cur_path
 let _real_path $ret
 cal lib_get_file_list $_real_path
 let _file_list $ret
 ife $_name $nil
  let _name ''
 fin
 cal filter_list_by_startwith $_file_list $_name
 let autocomplete_ $ret
end

cal init_files
def load_extra_files
 prs _fs '{"home": {"guest": {"note": [["txt"], "------------- Moon OS Manual ------------", "programs -- list all available programs", "ls [<d>]-- list directory contents", "pwd -- show path of current directory", "cd <d> -- change directory", "cat <f> -- concatenate and print a file", "v <f> -- view file contents", "./<exe_file> -- run an executable file", "echo <s> -- output an argument", "..[> <f>] -- write to a file", "..[>> <f>] -- append to a file", "Others: mv, cp, rm, head, tail, date ...", "-----------------------------------------"], "misc": {"test": "Hello World!"}, "led": [["exe"], "let val $0", "jeq $val $nil error", "jeq $val \\'1\\' turn_on", "jeq $val \\'0\\' turn_off", "jmp error", "#turn_on", "lib \\'dev.set_led\\' 0 1", "lib \\'dev.set_led\\' 1 1", "lib \\'dev.set_led\\' 2 1", "prt \\'LED ON\\'", "jmp end", "#turn_off", "lib \\'dev.set_led\\' 0 0", "lib \\'dev.set_led\\' 1 0", "lib \\'dev.set_led\\' 2 0", "prt \\'LED OFF\\'", "jmp end", "#error", "prt \\'1: ON; 0: OFF\\'", "#end"], "sample": {"hello": [["exe"], "prt \\'Hello!\\'", "slp 500", "prt \\'Bye~\\'"], "count": [["exe"], "let n 5", "#loop", "prt $n", "sub n $n 1", "slp 600", "jne $n 0 loop"], "compute_age": [["exe"], "prt \\'Input year born: \\' \\'\\'", "inp _year", "int _year $_year", "tim _current year", "sub age $_current $_year", "prt \\'Age: \\' \\'\\'", "prt $age"]}, "games": [["lnk", "/games"]], "script": [["bat"], "echo Hi $user", "echo \\'============\\'", "echo \\'Your current working directory:\\'", "pwd", "echo \\'Current date:\\'", "date"]}}, "games": {"sliding": [["exe", "A sliding puzzle game"], "/ https://runtime.siwei.dev/?src=puzzle", "/ by Siwei", "/ Feb 2019", "let num0 \\'001100010010010010010010001100\\'", "let num1 \\'001000001000001000001000001000\\'", "let num2 \\'011110000100001000010010001100\\'", "let num3 \\'001110010000001000010000001110\\'", "let num4 \\'010000010000011110010010010000\\'", "let num5 \\'001110010000001110000010011110\\'", "let num6 \\'001100010010001110000010001100\\'", "let num7 \\'001000001000001000010000011110\\'", "let num8 \\'001100010010001100010010001100\\'", "let num9 \\'001100010000011100010010001100\\'", "", "let empty \\'000000000000000000000000000000\\'", "", "let map {}", "put $map 1 $num1", "put $map 2 $num2", "put $map 3 $num3", "put $map 4 $num4", "put $map 5 $num5", "put $map 6 $num6", "put $map 7 $num7", "put $map 8 $num8", "put $map 9 $empty", "", "let cur 9", "", "/ -- print info --", "prt \\'SLIDING PUZZLE v1.0\\'", "prt \\'- Press arrow keys to slide\\'", "", "/ -- shuffle numbers--", "let move_count 0", "let prev_dir -1", "", "#shuffle", "rnd dir 0 4", "", "/ -- prevent slide back and forth", "sub opp $dir 2", "jeq $opp $prev_dir next_shuffle", "add opp $dir 2", "jeq $opp $prev_dir next_shuffle", "", "jne $dir 0 try_down", "/ try right", "jeq $cur 3 next_shuffle", "jeq $cur 6 next_shuffle", "jeq $cur 9 next_shuffle", "jmp swap_right", "#try_down", "jne $dir 1 try_left", "jeq $cur 7 next_shuffle", "jeq $cur 8 next_shuffle", "jeq $cur 9 next_shuffle", "jmp swap_down", "#try_left", "jne $dir 2 try_up", "jeq $cur 1 next_shuffle", "jeq $cur 4 next_shuffle", "jeq $cur 7 next_shuffle", "jmp swap_left", "#try_up", "jne $dir 3 next_shuffle", "jeq $cur 1 next_shuffle", "jeq $cur 2 next_shuffle", "jeq $cur 3 next_shuffle", "jmp swap_up", "", "#swap_right", "add target $cur 1", "jmp swap", "#swap_left", "sub target $cur 1", "jmp swap", "#swap_down", "add target $cur 3", "jmp swap", "#swap_up", "sub target $cur 3", "jmp swap", "", "#swap", "get $map $target ln", "put $map $cur $ln", "put $map $target $empty", "let cur $target", "add move_count $move_count 1", "let prev_dir $dir", "", "#next_shuffle", "jlt $move_count 20 shuffle", "", "jmp draw_number", "", "#begin", "", "/ -- check key --", "let key $lastkey", "jne $key 37 check_up", "jeq $cur 3 next", "jeq $cur 6 next", "jeq $cur 9 next", "jmp press_left", "#check_up", "jne $key 38 check_right", "jeq $cur 7 next", "jeq $cur 8 next", "jeq $cur 9 next", "jmp press_up", "#check_right", "jne $key 39 check_down", "jeq $cur 1 next", "jeq $cur 4 next", "jeq $cur 7 next", "jmp press_right", "#check_down", "jne $key 40 next", "jeq $cur 1 next", "jeq $cur 2 next", "jeq $cur 3 next", "jmp press_down", "", "jmp draw_number", "", "#press_left", "add target $cur 1", "jmp update_index", "#press_right", "sub target $cur 1", "jmp update_index", "#press_up", "add target $cur 3", "jmp update_index", "#press_down", "sub target $cur 3", "jmp update_index", "", "#update_index", "get $map $target ln", "put $map $cur $ln", "put $map $target $empty", "let cur $target", "", "/ -- draw numbers --", "#draw_number", "clr 20", "", "let x1 1", "let y1 2", "", "let idx_c 0", "let idx_r 0", "", "let idx 1", "#next_num", "get $map $idx num", "", "add x2 $x1 5", "add y2 $y1 6", "", "sub i $y1 1", "let j $x1", "", "#draw_num_row", "let j $x1", "add i $i 1", "#draw_num_col", "pop $num c", "drw $j $i $c", "jeq $j $x2 draw_num_row", "add j $j 1", "jne $i $y2 draw_num_col", "add x1 $x1 8", "add idx_c $idx_c 1", "add idx $idx 1", "jne $idx_c 3 next_num", "", "let x1 1", "add y1 $y1 7", "let idx_c 0", "add idx_r $idx_r 1", "jne $idx_r 3 next_num", "", "", "/ -- check win --", "get $map 1 pos_num", "jne $pos_num $num1 next", "get $map 2 pos_num", "jne $pos_num $num2 next", "get $map 3 pos_num", "jne $pos_num $num3 next", "get $map 4 pos_num", "jne $pos_num $num4 next", "get $map 5 pos_num", "jne $pos_num $num5 next", "get $map 6 pos_num", "jne $pos_num $num6 next", "get $map 7 pos_num", "jne $pos_num $num7 next", "get $map 8 pos_num", "jeq $pos_num $num8 win", "", "#next", "slp 10", "jmp begin", "", "#win", "prt \\'You Win!\\'"]}, "programs": {"cal": [["exe", "displays the calendar of the current month"], "let months []", "psh $months \\'Jan\\' \\'Feb\\' \\'Mar\\' \\'Apr\\'", "psh $months \\'May\\' \\'Jun\\' \\'Jul\\' \\'Aug\\'", "psh $months \\'Sep\\' \\'Oct\\' \\'Nov\\' \\'Dec\\'", "let month_days []", "psh $month_days 31 28 31 30 31 30 31 31 30 31 30 31", "tim _day day", "tim _month month", "tim _date date", "tim _year year", "get $months $_month _month_str", "prt \\'      \\' \\'\\'", "prt $_month_str \\' \\'", "prt $_year", "get $month_days $_month day_count", "jne $_month 1 check_leap_done", "mod res $_year 400", "jeq $res 0 leap_year", "mod res $_year 100", "jeq $res 0 check_leap_done", "mod res $_year 4", "jeq $res 0 leap_year", "jmp check_leap_done", "#leap_year", "let day_count 29", "#check_leap_done", "", "prt \\'Su Mo Tu We Th Fr Sa\\'", "let i 0", "let column 0", "let shift $_day", "mod back_off $_date 7", "sub shift $shift $back_off", "jlt $shift 0 add_seven", "jmp adjust_shift", "#add_seven", "add shift $shift 7", "#adjust_shift", "add shift $shift 1", "mod shift $shift 7", "#skip_cell", "jeq $i $shift start", "prt \\'   \\' \\'\\'", "add i $i 1", "add column $column 1", "jmp skip_cell", "", "#start", "let i 1", "#loop", "jgt $i $day_count done", "jgt $i 9 print_day", "prt \\' \\' \\'\\'", "#print_day", "ife $i $_date", " lib \\'term.color_print\\' $i 0 255", " prt \\' \\' \\'\\'", "els", " prt $i \\' \\'", "fin", "add i $i 1", "add column $column 1", "jne $column 7 loop", "prt \\'\\'", "let column 0", "jmp loop", "#done", "prt \\'\\'"], "calc": [["exe", "calculator"], "/ by Siwei", "/ Jun 2022", "", "/ precision", "let p 1000", "let precedence {}", "put $precedence \\'=\\' 0", "put $precedence \\'+\\' 1", "put $precedence \\'-\\' 1", "put $precedence \\'_-\\' 1  / negative sign", "put $precedence \\'_+\\' 1  / positive sign", "put $precedence \\'*\\' 2", "put $precedence \\'/\\' 2", "put $precedence \\'%\\' 2", "put $precedence \\'^\\' 4", "", "let num_char {}", "let num_char_list []", "psh $num_char_list \\'0\\' \\'1\\' \\'2\\' \\'3\\' \\'4\\' \\'5\\'", "psh $num_char_list \\'6\\' \\'7\\' \\'8\\' \\'9\\' \\'.\\'", "", "#num_char_loop", "pol $num_char_list nc", "jeq $nc $nil num_char_done", "put $num_char $nc 0", "jmp num_char_loop", "#num_char_done", "", "let env {}", "let temp_var_count 0", "", "def is_op", " let _t $0", " get $precedence $_t _prec", " jeq $_prec $nil not_op", " ret 1", " #not_op", " ret 0", "end", "", "/ pre-processing a number", "/ convert list|int -> int * p", "def pre", " let _val $0", " typ _typ $_val", " jne $_typ \\'list\\' normal_value", " get $_val 0 _sign", " get $_val 1 _int", " get $_val 2 _dec", " mul _int $_int $p", " add _res $_int $_dec", " mul _res $_res $_sign", " ret $_res", " #normal_value", " mul _val $_val $p", " ret $_val", "end", "", "def is_var_name", " / str => 0|1", " let _val $0", " typ _typ $_val", " jeq $_typ \\'str\\' continue", " ret 0", " #continue", " let _i 0", " #loop", " get $_val $_i _c", " jeq $_c \\'\\' false", " get $num_char $_c _v", " jeq $_v $nil true", " add _i $_i 1", " jmp loop", " #false", " ret 0", " #true", " ret 1", "end", "", "def parse_num", " / string =>", " / [sign(int),int(int),dec(int)]", " let _s $0", " typ _typ $_s", " jne $_typ \\'list\\' continue_parse", " / already parsed", " ret $_s", " #continue_parse", " cal is_var_name $_s", " jeq $ret 0 literal_value", " get $env $_s _val", " ret $_val", " #literal_value", " let _has_dec 0", " let _i 0", " let _int_part \\'0\\'", " let _dec_part \\'\\'", " len $_s _l", " #loop", " jeq $_i $_l check_done", " get $_s $_i _c", " add _i $_i 1", " jne $_c \\'.\\' parse_digit", " / .", " let _has_dec 1", " jmp loop", " #parse_digit", " jeq $_has_dec 1 parse_dec", " / int", " psh $_int_part $_c", " jmp loop", " /dec", " #parse_dec", " psh $_dec_part $_c", " jmp loop", " #check_done", " jeq $_has_dec 0 integer", " let _dec_val_str \\'\\'", " let _p $p", " #dec_loop", " pol $_dec_part _d", " div _p $_p 10", " jeq $_p 0 dec_loop_done", " jeq $_d \\'\\' append_zero", " psh $_dec_val_str $_d", " jmp dec_loop", " #append_zero", " psh $_dec_val_str \\'0\\'", " jmp dec_loop", " #dec_loop_done", " let _res []", " let _sign 1", " int _int $_int_part", " jgt $_int -1 sign_done", " let _sign -1", " #sign_done", " psh $_res $_sign", " int _dec $_dec_val_str", " psh $_res $_int", " psh $_res $_dec", " ret $_res", " #integer", " let _res []", " psh $_res 1", " int _int $_int_part", " psh $_res $_int", " psh $_res 0", " ret $_res", "end", "", "def div", " cal pre $0", " let _a $ret", " cal pre $1", " let _b $ret", " let _sign_a 1", " let _sign_b 1", " jgt $_a -1 sign_a_done", " let _sign_a -1", " mul _a $_a -1", " #sign_a_done", " jgt $_b -1 sign_b_done", " let _sign_b -1", " mul _b $_b -1", " #sign_b_done", " mul _sign $_sign_a $_sign_b", " jeq $_b 0 error", " let _res []", " psh $_res $_sign", " mul _a $_a $p", " div _full $_a $_b", " div _int $_full $p", " psh $_res $_int", " mul _int_m $_int $p", " sub _dec $_full $_int_m", " psh $_res $_dec", " ret $_res", " #error", " ret $nil", "end", "", "def mul", " cal pre $0", " let _a $ret", " cal pre $1", " let _b $ret", " mul _res $_a $_b", " cal div $_res $p", " cal div $ret $p", " ret $ret", "end", "", "def mod", " cal pre $0", " let _a $ret", " cal pre $1", " let _b $ret", " mod _res $_a $_b", " cal div $_res $p", " ret $ret", "end", "", "def add", " cal pre $0", " let _a $ret", " cal pre $1", " let _b $ret", " add _res $_a $_b", " cal div $_res $p", " ret $ret", "end", "", "def sub", " cal pre $0", " let _a $ret", " cal pre $1", " let _b $ret", " sub _res $_a $_b", " cal div $_res $p", " ret $ret", "end", "", "def pow", " cal pre $0", " let _a $ret", " let _power $1", " typ _power_typ $_power", " jeq $_power_typ \\'int\\' continue", " get $_power 2 _dec", " jgt $_dec 0 error", " get $_power 0 _power_sign", " get $_power 1 _power", " #continue", " let _res 1", " let _j 0", " #loop", " jeq $_j $_power done", " cal mul $_res $_a", " cal div $ret $p", " let _res $ret", " let _res $ret", " add _j $_j 1", " jmp loop", " #done", " jeq $_power_sign 1 return_result", " cal div 1 $_res", " ret $ret", " #return_result", " ret $_res", " #error", " ret $nil", "end", "", "def print", " let _val $0", " typ _typ $_val", " jeq $_val $nil error", " jne $_typ \\'list\\' normal_value", " get $_val 0 _sign", " get $_val 1 _int", " get $_val 2 _dec", " let _has_dot 0", " let _res \\'\\'", " jeq $_sign 1 positive", " add _res $_res \\'-\\'", " #positive", " add _res $_res $_int", " jeq $_dec 0 print_result", " add _res $_res \\'.\\'", " let _has_dot 1", " div _p $p 10", " #zero_loop", " jlt $_p $_dec zero_done", " jeq $_p $_dec zero_done", " add _res $_res \\'0\\'", " div _p $_p 10", " jmp zero_loop", " #zero_done", " add _res $_res $_dec", " jmp print_result", " #normal_value", " prt $_val", " ret", " #print_result", " jeq $_has_dot 0 print_result_direct", " #removing_zero_loop", " pop $_res _c", " / clean trailing zero/dot", " jeq $_c \\'0\\' removing_zero_loop", " jeq $_c \\'.\\' removing_zero_loop", " jeq $_c \\'\\' print_zero", " psh $_res $_c", " #print_result_direct", " prt $_res", " ret", " #print_zero", " prt 0", " ret", " #error", " prt \\'err\\'", "end", "", "def tokenize", " let _s $0", " let _tokens []", " let _t \\'\\' / current token", " let _prev_is_open_paren 1", " #loop", " pol $_s _c", " jeq $_c \\'\\' parse_done", " jeq $_c \\' \\' loop", " jeq $_c \\'(\\' operator", " jeq $_c \\')\\' operator", " cal is_op $_c", " jeq $ret 1 operator", " / operand", " psh $_t $_c", " let _prev_is_open_paren 0", " jmp loop", " #done_token", " jeq $_t \\'\\' loop", " psh $_tokens $_t", " let _t \\'\\'", " jmp loop", " #operator", " jeq $_t \\'\\' push_operator", " psh $_tokens $_t", " let _t \\'\\'", " #push_operator", " jeq $_prev_is_open_paren 0 normal_push_operator", " / check negative sign", " jne $_c \\'-\\' check_positive_sign", " psh $_tokens \\'_-\\'", " jmp loop", " #check_positive_sign", " jne $_c \\'+\\' normal_push_operator", " / ignore the positive sign", " jmp loop", " #normal_push_operator", " psh $_tokens $_c", " jne $_c \\'(\\' skip_prev_paren", " let _prev_is_open_paren 1", " #skip_prev_paren", " jmp loop", " #parse_done", " jeq $_t \\'\\' tokens_finished", " psh $_tokens $_t", " #tokens_finished", " ret $_tokens", "end", "", "def infix_to_postfix", " let _ts $0", " let _stack []", " let _res []", " #loop", " pol $_ts _t", " jeq $_t $nil done", " jne $_t \\'(\\' not_open", "  / == (", "  psh $_stack $_t", "  jmp loop", " #not_open", " jne $_t \\')\\' not_close", "  / == )", "  #parenthesis_loop", "   pop $_stack _top", "   jeq $_top $nil loop", "   jeq $_top \\'(\\' loop", "   psh $_res $_top", "  jmp parenthesis_loop", " jmp loop", " #not_close", " get $precedence $_t _prece", " jeq $_prece $nil not_operator", "  / == operator", "  #operator_loop", "  len $_stack _ss", "  jeq $_ss 0 operator_done", "  sub _last_idx $_ss 1", "  get $_stack $_last_idx _last", "  jeq $_last \\'(\\' operator_done", "  get $precedence $_last _last_prece", "  get $precedence $_t _this_prece", "  jlt $_last_prece $_this_prece operator_done", "  / a^b^c => abc^^ instead of ab^c^", "  jne $_t \\'^\\' not_pow_op", "  jeq $_last \\'^\\' operator_done", "  #not_pow_op", "  pop $_stack _top", "  psh $_res $_top", "  jmp operator_loop", "  #operator_done", "  psh $_stack $_t", " jmp loop", " #not_operator", "  / == operand", "  psh $_res $_t", " jmp loop", " #done", " / pop stack", " #pop_stack_loop", " pop $_stack _op", " jeq $_op $nil finished", " psh $_res $_op", " jmp pop_stack_loop", " #finished", " ret $_res", "end", "", "def eval", " let _tokens $0", " let _stack []", " #loop", " pol $_tokens _t", " jeq $_t $nil done", " get $precedence $_t _prec", " jne $_prec $nil operator", " / operand", " psh $_stack $_t", " jmp loop", " #operator", " pop $_stack _op2", " pop $_stack _op1", " jeq $_op2 $nil error", " cal parse_num $_op2", " let _op2 $ret", " jeq $_op2 $nil error", "", " / unary ops", " jne $_t \\'_-\\' not_neg", "  jeq $_op1 $nil skip_push_back", "  psh $_stack $_op1", "  #skip_push_back", "  cal mul $_op2 -1", "  psh $_stack $ret", "  jmp loop", " #not_neg", "", " / binary ops", " jeq $_op1 $nil error", "", " jne $_t \\'=\\' not_assign", "  cal is_var_name $_op1", "  jeq $ret 0 error", "  put $env $_op1 $_op2", "  jmp loop", " #not_assign", "", " cal parse_num $_op1", " let _op1 $ret", " jeq $_op1 $nil error", "", " jne $_t \\'-\\' not_sub", "  cal sub $_op1 $_op2", "  jeq $ret $nil error", "  psh $_stack $ret", "  jmp loop", " #not_sub", " jne $_t \\'+\\' not_add", "  cal add $_op1 $_op2", "  jeq $ret $nil error", "  psh $_stack $ret", "  jmp loop", " #not_add", " jne $_t \\'*\\' not_mul", "  cal mul $_op1 $_op2", "  jeq $ret $nil error", "  psh $_stack $ret", "  jmp loop", " #not_mul", " jne $_t \\'/\\' not_div", "  cal div $_op1 $_op2", "  jeq $ret $nil error", "  psh $_stack $ret", "  jmp loop", " #not_div", " jne $_t \\'%\\' not_mod", "  cal mod $_op1 $_op2", "  jeq $ret $nil error", "  psh $_stack $ret", "  jmp loop", " #not_mod", " jne $_t \\'^\\' not_pow", "  cal pow $_op1 $_op2", "  jeq $ret $nil error", "  psh $_stack $ret", "  jmp loop", " #not_pow", " jmp loop", " #done", " len $_stack _ss", " jgt $_ss 1 error", " get $_stack 0 _res", " cal is_var_name $_res", " jeq $ret 0 return_value", " / find var in env", " get $env $_res _res", " #return_value", " ret $_res", " #error", " ret \\'err\\'", "end", "", "def run", " cal tokenize $0", " len $ret _ts", " jeq $_ts 0 done", " / prt $ret", " cal infix_to_postfix $ret", " / prt $ret", " cal eval $ret", " jeq $ret $nil print_nil", " jeq $ret \\'err\\' print_err", " add temp_var_count $temp_var_count 1", " add _temp_var \\'r\\' $temp_var_count", " put $env $_temp_var $ret", " prt $_temp_var \\' := \\'", " cal print $ret", " ret", " #print_nil", " prt $nil", " ret", " #print_err", " prt \\'err\\'", " #done", "end", "", "prt \\'Calc v1.0\\'", "prt \\'Precision: \\' \\'\\'", "prt $p", "#repl", "prt \\'> \\' \\'\\'", "inp expr", "jeq $expr \\'\\' repl", "jeq $expr \\'exit\\' exit", "cal run $expr", "jmp repl", "#exit"], "cat": [["exe", "concatenate a file to the terminal output"], "let path_str $0", "jeq $path_str $nil print_error_invalid_name", "lib \\'util.get_path_by_str\\' $path_str path", "pop $path file_name", "lib \\'util.get_real_path\\' $path path", "jeq $path $nil print_error_invalid_path", "lib \\'util.verify_path\\' $path 1 is_valid", "jeq $is_valid 0 print_error_invalid_path", "lib \\'os.read_file\\' $path $file_name file_content", "jeq $file_content $nil print_error_invalid_path", "lib \\'os.get_file_type\\' $path $file_name file_type", "", "jeq $file_type \\'raw\\' raw_file", "jeq $file_type \\'txt\\' txt_file", "jeq $file_type \\'exe\\' exe_file", "jeq $file_type \\'bat\\' exe_file", "jeq $file_type \\'dir\\' print_error_directory", "typ data_type $file_content", "jeq $data_type \\'list\\' list_file", "jmp unsupported_file_type", "", "#raw_file", "prt $file_content", "jmp done", "", "#txt_file", "let i 1", "jmp list_file_content", "#list_file", "let i 0", "#list_file_content", "len $file_content file_len", "jeq $file_len 0 done", "#print_txt_loop", "jeq $i $file_len done", "get $file_content $i line", "prt $line", "add i $i 1", "jmp print_txt_loop", "jmp done", "", "#exe_file", "let i 1", "len $file_content file_len", "jeq $file_len 0 done", "#print_exe_loop", "jeq $i $file_len done", "get $file_content $i line", "/replace_char_in_str $line \\'\\\\\\\\n\\' \\'\\\\\\\\\\\\\\\\n\\'", "/ prt $i \\'\\'", "/ prt \\' |\\' \\'\\'", "prt $line", "add i $i 1", "jmp print_exe_loop", "jmp done", "", "#unsupported_file_type", "prt \\'ERR Unsupported file type\\'", "jmp done", "", "#print_error_invalid_name", "prt \\'USAGE cat file\\'", "jmp done", "", "#print_error_directory", "prt \\'ERR \\\\"\\' \\'\\'", "prt $file_name \\'\\'", "prt \\'\\\\" is a directory\\'", "jmp done", "", "#print_error_invalid_path", "prt \\'ERR File not found\\'", "#done"], "cd": [["exe", "change directory"], "let path_str $0", "jne $path_str $nil continue", "lib \\'os.get_home_path\\' home_path", "lib \\'os.set_current_path\\' $home_path", "jmp done", "#continue", "lib \\'util.get_path_by_str\\' $path_str path", "lib \\'util.get_real_path\\' $path real_path", "jeq $real_path $nil print_error_invalid_path", "lib \\'util.verify_path\\' $real_path 0 is_valid", "jeq $is_valid 0 print_error_invalid_path", "lib \\'os.set_current_path\\' $path", "jmp done", "#print_error_invalid_path", "prt \\'ERR Invalid path\\'", "#done"], "clear": [["exe", "clear the terminal screen"], "/ lib \\'term.get_height\\' h", "/ jeq $h $nil done", "/ sub h $h 1", "/ lib \\'term.set_prt_delay\\' 0", "/ let i 0", "/ #new_line_loop", "/ jeq $i $h clear", "/ prt \\'\\'", "/ add i $i 1", "/ jmp new_line_loop", "", "/ #clear", "", "/ let i 0", "/ #clear_loop", "/ jeq $i $h done", "/ lib \\'term.prev_line\\'", "/ add i $i 1", "/ jmp clear_loop", "", "/ #done", "/ lib \\'term.set_prt_delay\\' 1", "lib \\'term.clear_screen\\'"], "clock": [["exe", "digital clock"], "/ https://runtime.siwei.dev/?src=clock", "/ by Siwei", "/ Dec 2019", "", "let map {}", "put $map \\'\\' \\'0110100110011001100110010110\\'", "put $map 0 \\'0110100110011001100110010110\\'", "put $map 1 \\'0010011000100010001000100010\\'", "put $map 2 \\'0110100100010010010010001111\\'", "put $map 3 \\'0110100100010010000110010110\\'", "put $map 4 \\'0001001101011001111100010001\\'", "put $map 5 \\'1111100011100001000110010110\\'", "put $map 6 \\'0110100110001110100110010110\\'", "put $map 7 \\'1111000100010010001001000100\\'", "put $map 8 \\'0110100110010110100110010110\\'", "put $map 9 \\'0110100110010111000110010110\\'", "", "def draw_num", " / x, y, num", " let _x1 $0", " let _y1 $1", " let _num $2", " let _i 0", " #draw_num", " jeq $_num \\'\\' num_done", " pol $_num _c", " drw $_x1 $_y1 $_c", " add _x1 $_x1 1", " add _i $_i 1", " jne $_i 4 draw_num", " let _x1 $0", " let _i 0", " add _y1 $_y1 1", " jmp draw_num", " #num_done", "end", "", "let sec 0", "", "clr 20", "", "#refresh", "", "/ draw minute", "tim min minute", "str min $min", "pop $min d", "get $map $d num", "cal draw_num 19 8 $num", "pop $min d", "get $map $d num", "cal draw_num 14 8 $num", "", "/ draw hour", "tim hr hour", "str hr $hr", "pop $hr d", "get $map $d num", "cal draw_num 6 8 $num", "pop $hr d", "get $map $d num", "cal draw_num 1 8 $num", "", "/ draw second dots", "add sec $sec 1", "mod sec $sec 2", "drw 11 10 $sec", "drw 11 12 $sec", "", "slp 500", "jmp refresh"], "cowsay": [["exe", "speaking cow"], "let msg \\'Hi!\\'", "jeq $0 $nil continue", "let msg $0", "#continue", "", "len $msg length", "add length $length 2", "", "let i 0", "prt \\' \\' \\'\\'", "#upper", "jeq $i $length upper_done", "prt \\'_\\' \\'\\'", "add i $i 1", "jmp upper", "#upper_done", "prt \\'\\'", "", "prt \\'< \\' \\'\\'", "prt $msg \\'\\'", "prt \\' >\\'", "", "let i 0", "prt \\' \\' \\'\\'", "#lower", "jeq $i $length lower_done", "prt \\'-\\' \\'\\'", "add i $i 1", "jmp lower", "#lower_done", "prt \\'\\'", "", "prt \\'        \\\\\\\\\\\\\\\\   ^__^\\'", "prt \\'         \\\\\\\\\\\\\\\\  (oo)\\\\\\\\\\\\\\\\_______\\'", "prt \\'            (__)\\\\\\\\\\\\\\\\       )\\\\\\\\\\\\\\\\/\\\\\\\\\\\\\\\\\\'", "prt \\'                ||----w |\\'", "prt \\'                ||     ||\\'"], "cp": [["exe", "copy files"], "let src_path_str $0", "let dest_path_str $1", "jeq $src_path_str $nil print_error_invalid_name", "jeq $dest_path_str $nil print_error_invalid_name", "", "lib \\'util.get_path_by_str\\' $src_path_str src_path", "let err_param $src_path_str", "jeq $src_path $nil print_error_invalid_path", "pop $src_path src_file_name", "lib \\'util.get_real_path\\' $src_path src_path", "jeq $src_path $nil print_error_invalid_path", "lib \\'os.get_file_type\\' $src_path $src_file_name src_file_type", "jeq $src_file_type \\'dir\\' print_error_src_dir", "lib \\'os.read_file\\' $src_path $src_file_name file_data", "jeq $file_data $nil print_error_src_dir", "", "lib \\'util.get_path_by_str\\' $dest_path_str dest_path", "#retry_load_from_path", "pop $dest_path dest_file_name", "lib \\'util.get_real_path\\' $dest_path dest_path", "let err_param $dest_path_str", "jeq $dest_path $nil print_error_invalid_path", "", "lib \\'os.get_file_type\\' $dest_path $dest_file_name dest_file_type", "jne $dest_file_type \\'dir\\' copy_as_file", "/ copy to dir", "psh $dest_path $dest_file_name", "lib \\'os.write_file\\' $dest_path $src_file_name $file_data", "jmp done", "", "#copy_as_file", "jeq $dest_file_type \\'lnk\\' path_end_with_link", "lib \\'os.write_file\\' $dest_path $dest_file_name $file_data", "jmp done", "", "#path_end_with_link", "psh $dest_path $dest_file_name", "lib \\'util.get_real_path\\' $dest_path dest_path", "jmp retry_load_from_path", "", "#print_error_src_dir", "prt \\'ERR \\' \\'\\'", "prt $src_path_str \\'\\'", "prt \\' is a directory (not copied)\\'", "jmp done", "#print_error_invalid_name", "prt \\'USAGE cp source_file target_file/directory\\'", "jmp done", "#print_error_invalid_path", "prt \\'ERR No such file/directory: \\' \\'\\'", "prt $err_param", "#done"], "date": [["exe", "display date and time"], "let days []", "psh $days \\'Sun\\' \\'Mon\\' \\'Tue\\' \\'Wed\\' \\'Thu\\' \\'Fri\\' \\'Sat\\'", "let months []", "psh $months \\'Jan\\' \\'Feb\\' \\'Mar\\' \\'Apr\\'", "psh $months \\'May\\' \\'Jun\\' \\'Jul\\' \\'Aug\\'", "psh $months \\'Sep\\' \\'Oct\\' \\'Nov\\' \\'Dec\\'", "tim _day day", "get $days $_day _day_str", "tim _month month", "get $months $_month _month_str", "tim _date date", "tim _year year", "let date_str \\'\\'", "add date_str $date_str $_day_str", "add date_str $date_str \\' \\'", "add date_str $date_str $_date", "add date_str $date_str \\' \\'", "add date_str $date_str $_month_str", "add date_str $date_str \\' \\'", "add date_str $date_str $_year", "add date_str $date_str \\' \\'", "tim _hour hour", "tim _minute minute", "tim _second second", "jgt $_hour 9 add_hour", "add date_str $date_str \\'0\\'", "#add_hour", "add date_str $date_str $_hour", "add date_str $date_str \\':\\'", "jgt $_minute 9 add_minute", "add date_str $date_str \\'0\\'", "#add_minute", "add date_str $date_str $_minute", "add date_str $date_str \\':\\'", "jgt $_second 9 add_second", "add date_str $date_str \\'0\\'", "#add_second", "add date_str $date_str $_second", "prt $date_str"], "dir": [["lnk", "ls"]], "echo": [["exe", " display a line of text"], "ife $0 $nil", " jmp end", "fin", "", "let args []", "psh $args $0 $1 $2 $3 $4 $5 $6 $7", "let i 0", "#loop", "get $args $i string", "jeq $string $nil end", "get $string 0 fst_char", "ife $fst_char \\'$\\'", " pol $string _", " lib \\'os.get_env_var\\' $string string", "fin", "", "ife $string $nil", " let string \\'\\'", "fin", "", "ifg $i 0", " prt \\' \\' \\'\\'", "fin", "prt $string \\'\\'", "add i $i 1", "jmp loop", "", "/ ife $p \\'>\\'", "/  / write to file", "/  pol $_tokens f", "/  ife $f $nil", "/   cal print_error \\'File name missing\\'", "/  els", "/   cal get_current_dir", "/   let curr_dir $ret", "/   get $curr_dir $f fd", "/   prt $fd", "/    ife $fd $nil", "/     put $curr_dir $f $s", "/    els", "/     prt \\'File/directory exists, overwrite? Y/n\\'", "/     inp ans", "/     jeq $ans \\'y\\' overwrite", "/     jeq $ans \\'Y\\' overwrite", "/     jeq $ans \\'\\' overwrite", "/     jmp skip_ow", "/     #overwrite", "/     put $curr_dir $f $s", "/     #skip_ow", "/    fin", "/  fin", "/ fin", "/ ife $p \\'>>\\'", "/  / append to file", "/  pol $_tokens f", "/  ife $f $nil", "/   cal print_error \\'File name missing\\'", "/   jmp end", "/  els", "/   cal get_current_dir", "/   let curr_dir $ret", "/   get $curr_dir $f fc", "/   ife $fc $nil", "/    put $curr_dir $f $s", "/   els", "/    typ _ft $fc", "/    ife $_ft \\'str\\'", "/     add fc $fc \\'\\\\\\\\n\\'", "/     add fc $fc $s", "/     put $curr_dir $f $fc", "/    els", "/     cal print_error \\'Can only write to a raw file\\'", "/     jmp end", "/    fin", "/   fin", "/  fin", "/ fin", "", "#end", "prt \\'\\'"], "edit": [["exe", "file editor"], "let path_str $0", "jeq $path_str $nil print_error_invalid_name", "lib \\'util.get_path_by_str\\' $path_str path", "pop $path file_name", "lib \\'util.get_real_path\\' $path path", "jeq $path $nil print_error_invalid_path", "lib \\'util.verify_path\\' $path 1 is_valid", "jeq $is_valid 0 print_error_invalid_path", "", "def create_new_file", " let _file_content []", " let _file_meta []", " prt \\'Create a new file?\\'", " prt \\'t:txt(default) | e:exe | c:<cancel>\\'", " inp _choice", " ife $_choice \\'c\\'", "  ret $nil", " fin", " ife $_choice \\'e\\'", "  psh $_file_meta \\'exe\\'", " els", "  psh $_file_meta \\'txt\\'", " fin", " psh $_file_content $_file_meta", " lib \\'os.write_file\\' $path $file_name $_file_content", " prt \\'File created.\\'", " ret $_file_content", "end", "", "lib \\'os.read_file\\' $path $file_name file_content", "ife $file_content $nil", " cal create_new_file", " let file_content $ret", " jeq $ret $nil end", "fin", "", "lib \\'os.get_file_type\\' $path $file_name file_type", "", "/ check file editable", "jeq $file_type \\'txt\\' edit_file_valid", "jeq $file_type \\'exe\\' edit_file_valid", "prt \\'ERR File not editable\\'", "jmp end", "", "#edit_file_valid", "prt \\'== Edit v0.1 ==\\'", "prt \\'= v:view a:append i:insert r:replace h:help q:quit\\'", "prt \\'= \\' \\'\\'", "prt \\'<\\' $file_type", "prt \\'> \\' \\'\\'", "prt $file_name", "", "#edit_loop", "prt \\'>\\' \\'\\'", "inp _edit_in", "", "let _cmd_token \\'\\'", "#extract_cmd_token", "pol $_edit_in _c", "jeq $_c \\'\\' extract_cmd_token_done", "jeq $_c \\' \\' extract_cmd_token_done", "add _cmd_token $_cmd_token $_c", "jmp extract_cmd_token", "#extract_cmd_token_done", "let _content $_edit_in", "pol $_cmd_token _cmd", "let _cmd_arg $_cmd_token", "", "/ == QUIT", "jeq $_cmd \\'q\\' end", "", "/ == HELP", "ife $_cmd \\'h\\'", " prt \\'| v ..... View\\'", " prt \\'| a ..... Append\\'", " prt \\'| i<n> .. Insert at line <n>\\'", " prt \\'| r<n> .. Replace line <n>\\'", " prt \\'| q ..... Quit\\'", "fin", "", "/ == VIEW", "ife $_cmd \\'v\\'", " let _i 0    / line number", " for _row $file_content", "  jeq $_i 0 edit_view_skip_meta", "  /cal replace_char_in_str $_row \\'\\\\\\\\n\\' \\'\\\\\\\\\\\\\\\\n\\'", "  /let _row $ret", "  add _ln $_i \\' |\\'", "  add _row $_ln $_row", "  prt $_row", "  #edit_view_skip_meta", "  add _i $_i 1", " nxt", "fin", "", "/ == APPEND", "ife $_cmd \\'a\\'", " /cal replace_esc_in_str $_content", " psh $file_content $_content", "fin", "", "/ == DELETE", "ife $_cmd \\'d\\'", " int _line_number $_cmd_arg", " let new_content []", " let _line_count 0", " for line $file_content", "  ife $_line_count $_line_number", "   jmp _edit_delete_continue", "  fin", "  psh $new_content $line", "  #_edit_delete_continue", "  add _line_count $_line_count 1", " nxt", " lib \\'os.write_file\\' $path $file_name $new_content", " let file_content $new_content", "fin", "", "/ == INSERT", "ife $_cmd \\'i\\'", " int _line_number $_cmd_arg", " let new_content []", " let _line_count 0", " for line $file_content", "  ife $_line_count $_line_number", "   /cal replace_esc_in_str $_content", "   psh $new_content $_content", "  fin", "  psh $new_content $line", "  add _line_count $_line_count 1", " nxt", " lib \\'os.write_file\\' $path $file_name $new_content", " let file_content $new_content", "fin", "", "/ == REPLACE", "ife $_cmd \\'r\\'", " int _line_number $_cmd_arg", " let new_content []", " let _line_count 0", " for line $file_content", "  ife $_line_count $_line_number", "   /cal replace_esc_in_str $_content", "   psh $new_content $_content", "  els", "   psh $new_content $line", "  fin", "  add _line_count $_line_count 1", " nxt", " lib \\'os.write_file\\' $path $file_name $new_content", " let file_content $new_content", "fin", "", "jmp edit_loop", "", "#print_error_invalid_path", "prt \\'ERR File not found\\'", "jmp end", "", "#print_error_invalid_name", "prt \\'USAGE edit <file_name>\\'", "jmp end", "", "#end"], "env": [["exe", "show environment variables"], "lib \\'util.get_path_by_str\\' \\'/env\\' path", "lib \\'os.get_file_list\\' $path lst", "", "#loop", "pol $lst name", "jeq $name $nil done", "lib \\'os.read_file\\' $path $name value", "prt $name \\'=\\'", "prt $value", "jmp loop", "", "#done"], "export": [["exe", " set environment variables"], "let expr $0", "", "let var_name \\'\\'", "", "#loop", "pol $expr c", "jeq $c \\'=\\' done_split", "add var_name $var_name $c", "jmp loop", "#done_split", "", "lib \\'os.set_env_var\\' $var_name $expr"], "func_test": [["exe", "test function"], "def my_func", " prt 123", "end", "", "def foo", " prt \\'foo\\'", " let _a 12", " cal bar $_a", "end", "", "def bar", " prt \\'bar\\'", " let i 0", " #loop", " jeq $i 3 end", " prt $i", " add i $i 1", " jmp loop", " #end", " prt $0", "end", "", "cal foo", "prt \\'-----\\'", "", "let _a 111", "let a 222", "", "def test", " prt $0", " let _arg $0", " let _a 555", " prt $_a", " prt $a", " add _b $_arg 2", " #lable_001", " ret $_b", "end", "", "cal test 45", "prt $ret", "", "let i 0", "#loop", "jeq $i 3 end", "prt $i", "add i $i 1", "jmp loop", "#end"], "fv": [["exe", "file viewer"], "lib \\'term.get_height\\' h", "lib \\'term.get_width\\' w", "jeq $h $nil err_term_not_supported", "sub hh $h 1", "", "let menu_width 15", "", "lib \\'term.set_prt_delay\\' 0", "lib \\'term.alternate_buffer\\'", "", "let cursor 1", "let cur_list []", "lib \\'os.get_current_path\\' path", "", "", "def clear", " let i 0", " #clear_loop", " jeq $i $hh clear_done", " lib \\'term.clear_line\\'", " lib \\'term.prev_line\\'", " add i $i 1", " jmp clear_loop", " #clear_done", " lib \\'term.clear_line\\'", " / * BUG: calling lib will clear the primary buffer", " / lib \\'term.clear_screen\\'", "end", "", "def pad_text", " let _text $0", " let _width $1", " len $_text _l", " sub _p $_width $_l", " for _i $_p", "  psh $_text \\' \\'", " nxt", " ret $_text", "end", "", "def show_top_bar", " let _bar_left $0", " add _bar_left $_bar_left \\'  \\'", " lib \\'term.color_print\\' $_bar_left 0 250", " let _bar_right \\'Press q to quit   \\'", " add _bar_right $_bar_right $cursor", " add _bar_right $_bar_right \\'/\\'", " len $cur_list _l", " add _bar_right $_bar_right $_l", " len $_bar_left _left_len", " len $_bar_right _right_len", " sub _free_len $w $_left_len", " sub _free_len $_free_len $_right_len", " mul _bar_space \\' \\' $_free_len", " lib \\'term.color_print\\' $_bar_space 0 250", " lib \\'term.color_print\\' $_bar_right 0 250", "end", "", "def show_preview_content", " let _content $0", " let _type $1", " sub _width $w $menu_width", "", " typ _t $_content", " ife $_type \\'raw\\'", "  prt $_content", "  jmp preview_done", " fin", " jeq $_type \\'txt\\' preview_list_type", " jeq $_type \\'exe\\' preview_list_type", " jeq $_type \\'bat\\' preview_list_type", " jmp preview_done", " #preview_list_type", "  let _line_count $h", "  len $_content _fl", "  ifg $_line_count $_fl", "   let _line_count $_fl", "  fin", "  let _i 0", "  let _ln 2", "  #content_loop", "  jeq $_i $_line_count content_done", "  get $_content $_i _line", "  #trim_loop", "  len $_line _ll", "  ifg $_ll $_width", "   pop $_line _", "   jmp trim_loop", "  fin", "  prt $_line \\'\\'", "  add _preview_left $menu_width 1", "  lib \\'term.set_cursor_position\\' $_ln $_preview_left", "  add _ln $_ln 1", "  add _i $_i 1", "  jmp content_loop", "  #content_done", " #preview_done", "end", "", "def refresh", " cal clear", " lib \\'os.get_file_list\\' $path cur_list", "", " / == show top bar", " let path_str \\'/\\'", " let _i 0", " len $path _pl", " #path_loop", " jeq $_i $_pl path_loop_done", " get $path $_i _d", " add path_str $path_str $_d", " add path_str $path_str \\'/\\'", " add _i $_i 1", " jmp path_loop", " #path_loop_done", " cal show_top_bar $path_str", " prt \\'\\'", "", " / == show file list", " ife $cur_list []", "  / set cursor to 0 when dir is empty", "  let cursor 0", " fin", " cal pad_text \\'../\\' $menu_width", " let go_up_text $ret", " ife $cursor 0", "  lib \\'term.color_print\\' $go_up_text 0 255", "  prt \\'\\'", " els", "  prt $go_up_text", " fin", " len $cur_list _l", " let _i 0", " #file_list_loop", " jeq $_i $_l file_list_done", " jgt $_i $_l file_list_done", " get $cur_list $_i _fn", " lib \\'os.get_file_type\\' $path $_fn _ft", " ife $_ft \\'dir\\'", "  add _fn $_fn \\'/\\'", " fin", " cal pad_text $_fn $menu_width", " let _fn $ret", " add _j $_i 1", " ife $_j $cursor", "  lib \\'term.color_print\\' $_fn 0 255", "  prt \\'\\'", " els", "  prt $_fn", " fin", " add _i $_i 1", " jmp file_list_loop", " #file_list_done", "", " / == show preview", " add _preview_left $menu_width 1", " lib \\'term.set_cursor_position\\' 2 $_preview_left", " ife $cursor 0", "  prt \\'(go to parent directory)\\'", " els", "  sub _j $cursor 1", "  get $cur_list $_j _file", "  lib \\'os.get_file_type\\' $path $_file _ft", "  jeq $_ft \\'txt\\' preview_content", "  jeq $_ft \\'raw\\' preview_content", "  jeq $_ft \\'exe\\' preview_content", "  jeq $_ft \\'bat\\' preview_content", "  jmp file_type_cannot_preview", "  #preview_content", "   lib \\'os.read_file\\' $path $_file _fc", "   cal show_preview_content $_fc $_ft", "  jmp preview_done", "  #file_type_cannot_preview", "   prt \\'<\\' \\'\\'", "   prt $_ft \\'>\\'", "  #preview_done", " fin", " lib \\'term.set_cursor_position\\' $h 0", "end", "", "/ === MAIN LOOP ===", "#loop", "cal refresh", "", "lib \\'term.read_key\\' key", "jeq $key 81 exit", "ife $key 40", " / arrow down", " len $cur_list lst_len", " jeq $cursor $lst_len skip_arrow_down", " add cursor $cursor 1", " #skip_arrow_down", "fin", "ife $key 38", " / arrow up", " ifg $cursor 0", "  sub cursor $cursor 1", " fin", "fin", "ife $key 13", " / enter", " ife $cursor 0", "  pop $path _", "  let cursor 1", " els", "  sub cur $cursor 1  / 1st is go-up", "  get $cur_list $cur fn", "  lib \\'os.get_file_type\\' $path $fn ft", "  ife $ft \\'dir\\'", "   psh $path $fn", "   let cursor 1", "  els", "   / not a dir", "  fin", " fin", "fin", "", "slp 100", "jmp loop", "", "", "#err_term_not_supported", "prt \\'ERR Your current terminal is not supported\\'", "jmp exit", "", "#exit", "lib \\'term.primary_buffer\\'", "lib \\'term.set_prt_delay\\' 1"], "head": [["exe", "display first lines of a file"], "let path_str $0", "jeq $path_str $nil print_error_invalid_name", "lib \\'util.get_path_by_str\\' $path_str path", "pop $path file_name", "lib \\'util.get_real_path\\' $path path", "lib \\'util.verify_path\\' $path 1 is_valid_path", "jeq $is_valid_path 0 print_error_invalid_path", "lib \\'os.read_file\\' $path $file_name file_content", "jeq $file_content $nil print_error_invalid_path", "lib \\'os.get_file_type\\' $path $file_name file_type", "let default_len 10", "let line_count 0", "", "jeq $file_type \\'raw\\' raw_file", "jeq $file_type \\'txt\\' file_with_meta", "jeq $file_type \\'exe\\' file_with_meta", "jeq $file_type \\'dir\\' print_error_directory", "typ data_type $file_content", "jeq $data_type \\'list\\' list_file", "jmp unsupported_file_type", "", "#raw_file", "prt $file_content", "jmp done", "", "#file_with_meta", "let i 1", "jmp output", "#list_file", "let i 0", "#output", "get $file_content $i line", "jeq $line $nil done", "jeq $line_count $default_len done", "prt $line", "add i $i 1", "add line_count $line_count 1", "jmp output", "", "#unsupported_file_type", "prt \\'ERR Unsupported file type\\'", "jmp done", "", "#print_error_invalid_name", "prt \\'USAGE head file\\'", "jmp done", "", "#print_error_directory", "prt \\'ERR \\\\"\\' \\'\\'", "prt $file_name \\'\\'", "prt \\'\\\\" is a directory\\'", "jmp done", "", "#print_error_invalid_path", "prt \\'ERR File not found\\'", "#done"], "ln": [["exe", "make a link"], "let src_path_str $0", "let link_path_str $1", "jeq $src_path_str $nil print_error_invalid_name", "jeq $link_path_str $nil print_error_invalid_name", "", "let err_param $link_path_str", "lib \\'util.get_path_by_str\\' $link_path_str dest_path", "pop $dest_path link_file_name", "/ check dest path valid", "lib \\'util.get_real_path\\' $dest_path dest_path", "lib \\'util.verify_path\\' $dest_path 0 is_valid_path", "jeq $is_valid_path 0 print_error_invalid_path", "", "/ check dest not exists", "psh $dest_path $link_file_name", "lib \\'util.verify_path\\' $dest_path 1 file_exists", "jeq $file_exists 1 print_error_exists", "pop $dest_path link_file_name", "", "lib \\'util.get_path_by_str\\' $link_path_str 1 1 dest_path", "", "let link_meta []", "psh $link_meta \\'lnk\\'", "psh $link_meta $src_path_str", "let link_content []", "psh $link_content $link_meta", "lib \\'os.write_file\\' $dest_path $link_file_name $link_content", "jmp done", "", "#copy_as_file", "lib \\'os.write_file\\' $dest_path $dest_file_name $file_data", "jmp done", "", "#print_error_src_dir", "prt \\'ERR \\' \\'\\'", "prt $src_path_str \\'\\'", "prt \\' is a directory (not copied)\\'", "jmp done", "#print_error_invalid_name", "prt \\'USAGE ln source_file target_file/directory\\'", "jmp done", "#print_error_invalid_path", "prt \\'ERR No such file/directory: \\' \\'\\'", "prt $err_param", "jmp done", "#print_error_exists", "prt \\'ERR File/directory exists: \\' \\'\\'", "prt $err_param", "jmp done", "", "#done"], "login": [["exe", "login to remote server"], "let AUTH_API \\'https://siwei.dev\\'", "add API_SESSION $AUTH_API \\'/session\\'", "add API_LOGIN $AUTH_API \\'/login\\'", "add API_LOGOUT $AUTH_API \\'/logout?redirect=false\\'", "add API_LOAD_FILE $AUTH_API \\'/api/fs/load\\'", "", "def build_req", " let _method $0", " let _url $1", " let _data $2", " let _with_credential $3", " let _req {}", " put $_req \\'method\\' $_method", " put $_req \\'url\\' $_url", " jeq $_data $nil skip_data", "  put $_req \\'data\\' $_data", " #skip_data", " ife $_with_credential 1", "  put $_req \\'with_credential\\' 1", " fin", " ret $_req", "end", "", "def init_account", " let _username $0", " prt \\'Switching to logged-in account...\\' \\'\\'", " lib \\'os.set_env_var\\' \\'user\\' $_username", " let _home_dir []", " psh $_home_dir \\'home\\'", " lib \\'os.write_file\\' $_home_dir $_username {}", " lib \\'os.get_home_path\\' _home_path", " lib \\'os.set_current_path\\' $_home_path", " prt \\'[done]\\'", "end", "", "def switch_to_guest", " lib \\'os.get_home_path\\' _home_path", " lib \\'os.delete_path\\' $_home_path", " lib \\'os.set_env_var\\' \\'user\\' \\'guest\\'", " lib \\'os.get_home_path\\' _home_path", " lib \\'os.set_current_path\\' $_home_path", "end", "", "def load_user_files", " let _username $0", " prt \\'Loading files...\\' \\'\\'", " cal build_req \\'GET\\' $API_LOAD_FILE $nil 1", " lib \\'net.http\\' $ret _res", " get $_res \\'status\\' _status", " ife $_status 0", "  prt \\'[done]\\'", "  get $_res \\'home\\' _home_data", "  prs _parsed_data $_home_data", "  let _home_dir []", "  psh $_home_dir \\'home\\'", "  lib \\'os.write_file\\' $_home_dir $_username $_parsed_data", "  ret 0  / success", " els", "  prt \\'[failed]\\'", "  ret 1  / failed", " fin", "end", "", "/ check existing session", "cal build_req \\'POST\\' $API_SESSION $nil 1", "let req $ret", "lib \\'net.http\\' $req res", "get $res \\'status\\' status", "jeq $status \\'1\\' start_login", "get $res \\'username\\' username", "lib \\'os.get_env_var\\' \\'user\\' current_user", "jeq $username $current_user error_already_logged_in", "", "", "/ resume existing session", "prt \\'Existing session found, resuming\\'", "jmp setup_user", "", "", "/ create a new session", "#start_login", "prt \\'Username:\\' \\'\\'", "inp username", "prt \\'Password:\\' \\'\\'", "inp password \\'*\\'", "prt \\'logging in...\\'", "let payload {}", "put $payload \\'username\\' $username", "put $payload \\'password\\' $password", "cal build_req \\'POST\\' $API_LOGIN $payload 1", "let req $ret", "lib \\'net.http\\' $req res", "get $res \\'status\\' status", "jeq $status \\'success\\' setup_user", "prt \\'ERR failed to login, \\' \\'\\'", "prt $status", "jmp end", "", "", "/ setup logged in user", "#setup_user", "cal init_account $username", "cal load_user_files $username", "ife $ret 0", " prt \\'Logged in as \\' \\'\\'", " prt $username", "els", " prt \\'ERR Faild to load user files.\\'", " prt \\'Logging out...\\' \\'\\'", " cal build_req \\'GET\\' $API_LOGOUT $nil 1", " lib \\'net.http\\' $ret _", " prt \\'[done]\\'", " prt \\'Switching back to guest account...\\' \\'\\'", " cal switch_to_guest", " prt \\'[done]\\'", " prt \\'ERR Login cancelled.\\'", "fin", "jmp end", "", "#error_already_logged_in", "prt \\'Already logged in as \\' $username", "prt \\'\\'", "jmp end", "", "#error_load_file", "prt \\'ERR failed to load user files\\'", "jmp end", "", "#end"], "logout": [["exe", "logout from remote server"], "let AUTH_API \\'https://siwei.dev\\'", "add API_SESSION $AUTH_API \\'/session\\'", "add API_LOGOUT $AUTH_API \\'/logout?redirect=false\\'", "add API_SAVE_FILE $AUTH_API \\'/api/fs/save\\'", "", "def build_req", " let _method $0", " let _url $1", " let _data $2", " let _with_credential $3", " let _req {}", " put $_req \\'method\\' $_method", " put $_req \\'url\\' $_url", " jeq $_data $nil skip_data", "  put $_req \\'data\\' $_data", " #skip_data", " ife $_with_credential 1", "  put $_req \\'with_credential\\' 1", " fin", " ret $_req", "end", "", "/ check existing session", "cal build_req \\'POST\\' $API_SESSION $nil 1", "lib \\'net.http\\' $ret res", "get $res \\'status\\' status", "jeq $status \\'1\\' error_not_logged_in", "get $res \\'username\\' session_username", "lib \\'os.get_env_var\\' \\'user\\' current_user", "jne $session_username $current_user error_login_status", "", "/ save files", "prt \\'Saving files...\\' \\'\\'", "let home_dir []", "psh $home_dir \\'home\\'", "lib \\'os.read_file\\' $home_dir $current_user user_files", "str user_files_str $user_files", "let payload {}", "put $payload \\'data\\' $user_files_str", "cal build_req \\'POST\\' $API_SAVE_FILE $payload 1", "lib \\'net.http\\' $ret res", "get $res \\'status\\' status", "jne $status 0 error_save_file", "prt \\'[done]\\'", "", "/ logout session", "prt \\'Logging out...\\' \\'\\'", "cal build_req \\'GET\\' $API_LOGOUT $nil 1", "lib \\'net.http\\' $ret _", "prt \\'[done]\\'", "", "/ switch to guest", "def switch_to_guest", " lib \\'os.get_home_path\\' _home_path", " lib \\'os.delete_path\\' $_home_path", " lib \\'os.set_env_var\\' \\'user\\' \\'guest\\'", " lib \\'os.get_home_path\\' _home_path", " lib \\'os.set_current_path\\' $_home_path", "end", "", "prt \\'Switching to guest account...\\' \\'\\'", "cal switch_to_guest", "prt \\'[done]\\'", "", "prt \\'Logged out\\'", "jmp end", "", "#error_save_file", "prt \\'[fail]\\'", "prt \\'ERR failed to save files, logout aborted\\'", "jmp end", "", "#error_login_status", "prt \\'ERR invalid login status, please login first\\'", "jmp end", "", "#error_not_logged_in", "prt \\'ERR not logged in\\'", "jmp end", "", "#end"], "ls": [["exe", "list directory contents"], "let type_map {}", "put $type_map \\'txt\\' \\'TXT\\'", "put $type_map \\'exe\\' \\'EXE\\'", "put $type_map \\'raw\\' \\'RAW\\'", "put $type_map \\'dir\\' \\'DIR\\'", "put $type_map \\'lnk\\' \\'LNK\\'", "put $type_map \\'bat\\' \\'BAT\\'", "put $type_map \\'lst\\' \\'LST\\'", "jeq $0 $nil use_current_path", "lib \\'util.get_path_by_str\\' $0 path", "jeq $path $nil print_error", "jmp continue_with_path", "#use_current_path", "lib \\'os.get_current_path\\' path", "#continue_with_path", "lib \\'util.get_real_path\\' $path path", "jeq $path $nil print_error", "lib \\'util.verify_path\\' $path 0 is_valid", "jeq $is_valid 0 print_error", "lib \\'os.get_file_list\\' $path lst", "", "len $lst lst_len", "/ decide number of columns", "let col 1", "lib \\'term.get_width\\' w", "jeq $w $nil term_not_supported", "let col 2", "div col_w $w $col", "add rows $lst_len 1", "div rows $rows $col", "#term_not_supported", "", "let the_list []", "let idx 0", "let col_idx 0", "", "#loop", "jeq $idx $lst_len to_print", "get $lst $idx f", "", "lib \\'os.get_file_type\\' $path $f file_type", "let file_ent \\'<\\'", "get $type_map $file_type t", "add file_ent $file_ent $t", "add file_ent $file_ent \\'> \\'", "add file_ent $file_ent $f", "", "jne $file_type \\'lnk\\' not_link", "add file_ent $file_ent \\' -> \\'", "lib \\'os.read_file\\' $path $f file_content", "get $file_content 0 file_meta", "get $file_meta 1 link_path", "add file_ent $file_ent $link_path", "#not_link", "", "get $the_list $col_idx cur_line", "jne $cur_line $nil append_line", "/ a new line", "psh $the_list $file_ent", "jmp continue", "#append_line", "len $cur_line cur_len", "sub rest_space $col_w $cur_len", "mul filler \\' \\' $rest_space", "add temp_line $cur_line $filler", "add temp_line $temp_line $file_ent", "put $the_list $col_idx $temp_line", "", "#continue", "add idx $idx 1", "add col_idx $col_idx 1", "jne $col_idx $rows loop", "let col_idx 0", "jmp loop", "", "#to_print", "pol $the_list line", "jeq $line $nil end", "prt $line", "jmp to_print", "", "#print_error", "prt \\'ERR Invalid path\\'", "jmp end", "#end"], "matrix": [["exe", " simulates the code rain from <The Matrix>"], "", "lib \\'term.get_height\\' h", "lib \\'term.get_width\\' w", "jeq $h $nil err_term_not_supported", "sub h $h 1", "lib \\'term.set_prt_delay\\' 0", "", "let str_pool \\'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890+-<>?[]{}@#$%&\\'", "", "def rand_char", " len $str_pool _pl", " sub _pl $_pl 1", " rnd _idx 0 $_pl", " get $str_pool $_idx _c", " ret $_c", "end", "", "def rand_string", " let _s \\'\\'", " rnd _l 4 $h", " let _i 0", " #loop", " jeq $_i $_l done", " cal rand_char", " add _s $_s $ret", " add _i $_i 1", " jmp loop", " #done", " ret $_s", "end", "", "let offsets []", "let cols []", "", "def init", " let _i 0", " #loop", "  jeq $_i $w done", "  rnd _offset 0 $h", "  psh $offsets $_offset", "  cal rand_string", "  psh $cols $ret", "  add _i $_i 1", " jmp loop", " #done", "end", "", "def update", " let _i 0", " #loop", "  jeq $_i $w done", "  pol $offsets _offset", "  pol $cols _col", "  / update offset", "  add _offset $_offset 1", "  ife $_offset $h", "   / new column string", "   cal rand_string", "   let _new_col $ret", "   len $_new_col _len", "   sub _offset 0 $_len", "   psh $offsets $_offset", "   psh $cols $_new_col", "  els", "   psh $offsets $_offset", "   / update column string", "   pol $_col _", "   cal rand_char", "   psh $_col $ret", "   psh $cols $_col", "  fin", "  add _i $_i 1", " jmp loop", " #done", "end", "", "def clear", " let _i 0", " lib \\'term.clear_line\\'", " #clear_loop", "  jeq $_i $h done", "  lib \\'term.prev_line\\'", "  lib \\'term.clear_line\\'", "  add _i $_i 1", " jmp clear_loop", " #done", "end", "", "def display", " let _i 0", " #loop_row", "  jeq $_i $h done", "  let _line \\'\\'", "  let _j 0", "  #loop_col", "   jeq $_j $w line_done", "   get $offsets $_j _offset", "   jlt $_i $_offset add_space", "   get $cols $_j _col", "   len $_col _col_len", "   sub _k $_i $_offset", "   jeq $_k $_col_len add_space", "   jgt $_k $_col_len add_space", "   get $_col $_k _c", "   add _line $_line $_c", "   jmp continue_col", "   #add_space", "   add _line $_line \\' \\'", "   #continue_col", "   add _j $_j 1", "  jmp loop_col", "  #line_done", "  prt $_line", "  add _i $_i 1", " jmp loop_row", " #done", "end", "", "/ -- main --", "cal init", "let clock 0", "#loop", " cal display", " prt \\'Frame count: \\' \\'\\'", " prt $clock \\'\\'", " slp 10", " cal update", " cal clear", " let key $lastkey", " jeq $key 81 exit  / q", " add clock $clock 1", "jmp loop", "/ -- end of main --", "", "#exit", "cal clear", "lib \\'term.set_prt_delay\\' 1", "jmp end", "", "#err_term_not_supported", "prt \\'ERR Your terminal is not supported\\'", "jmp end", "", "#end"], "mkdir": [["exe", "make a directory"], "let path_str $0", "jeq $path_str $nil print_error_invalid_name", "let new_dir_name \\'\\'", "#extract_last", "pop $path_str c", "jeq $c \\'\\' continue", "jeq $c \\'/\\' continue", "add new_dir_name $c $new_dir_name", "jmp extract_last", "#continue", "psh $path_str $c", "lib \\'util.get_path_by_str\\' $path_str path", "jeq $path $nil print_error_invalid_path", "lib \\'util.get_real_path\\' $path path", "jeq $path $nil print_error_invalid_path", "lib \\'util.verify_path\\' $path 0 is_valid", "jeq $is_valid 0 print_error_invalid_path", "", "lib \\'os.read_file\\' $path $new_dir_name existing", "jne $existing $nil print_error_exists", "", "lib \\'os.make_dir\\' $path $new_dir_name", "jmp done", "", "#print_error_exists", "prt \\'ERR File/directory exists\\'", "jmp done", "#print_error_invalid_name", "prt \\'USAGE mkdir directory\\'", "jmp done", "#print_error_invalid_path", "prt \\'ERR No such file/directory\\'", "#done"], "motd": [["exe", "show welcome message"], "lib \\'os.get_os_info\\' info", "get $info 0 os_name", "get $info 1 os_ver", "get $info 2 os_build", "prt $os_name \\'\\'", "prt \\'  v\\' \\'\\'", "prt $os_ver \\' (build \\'", "prt $os_build \\')\\'", "prt \\'\\'", "prt \\'Copyright (c) 1992 RunTech, Inc.\\'", "prt \\'All rights reserved.\\'", "prt \\'\\'", "prt \\'Welcome\\'"], "mv": [["exe", "move files"], "let src_path_str $0", "let dest_path_str $1", "jeq $src_path_str $nil print_error_invalid_name", "jeq $dest_path_str $nil print_error_invalid_name", "", "lib \\'util.get_path_by_str\\' $src_path_str src_path", "let err_param $src_path_str", "jeq $src_path $nil print_error_invalid_path", "pop $src_path src_file_name", "lib \\'util.get_real_path\\' $src_path src_path", "jeq $src_path $nil print_error_invalid_path", "lib \\'os.get_file_type\\' $src_path $src_file_name src_file_type", "jeq $src_file_type \\'dir\\' print_error_src_dir", "lib \\'os.read_file\\' $src_path $src_file_name file_data", "jeq $file_data $nil print_error_src_dir", "", "lib \\'util.get_path_by_str\\' $dest_path_str dest_path", "lib \\'util.get_real_path\\' $dest_path dest_path", "let err_param $dest_path_str", "jeq $dest_path $nil print_error_invalid_path", "pop $dest_path dest_file_name", "lib \\'os.get_file_type\\' $dest_path $dest_file_name dest_file_type", "", "jne $dest_file_type \\'dir\\' copy_as_file", "/ copy to dir", "psh $dest_path $dest_file_name", "lib \\'os.write_file\\' $dest_path $src_file_name $file_data", "jmp delete_src", "", "#copy_as_file", "lib \\'os.write_file\\' $dest_path $dest_file_name $file_data", "jmp delete_src", "", "#delete_src", "psh $src_path $src_file_name", "lib \\'os.delete_path\\' $src_path", "jmp done", "", "#print_error_src_dir", "prt \\'ERR \\' \\'\\'", "prt $src_path_str \\'\\'", "prt \\' is a directory (not copied)\\'", "jmp done", "#print_error_invalid_name", "prt \\'USAGE mv source_file target_file/directory\\'", "jmp done", "#print_error_invalid_path", "prt \\'ERR No such file/directory: \\' \\'\\'", "prt $err_param", "#done"], "neofetch": [["exe", "a system info script"], "let param $0", "", "lib \\'os.get_os_info\\' info", "get $info 0 os_name", "get $info 1 os_ver", "get $info 2 os_build", "get $info 3 os_host", "lib \\'util.get_path_by_str\\' \\'/env\\' path", "lib \\'os.read_file\\' $path \\'user\\' username", "", "lib \\'term.get_height\\' h", "lib \\'term.get_width\\' w", "jne $h $nil normal_mode", "/ compatible mode", "prt \\'[In term compatible mode]\\'", "prt $username", "prt \\'------------\\'", "prt \\'OS: \\' \\'\\'", "prt $os_name", "prt \\'OS Ver: \\' \\'\\'", "prt $os_ver", "prt \\'OS Build: \\' \\'\\'", "prt $os_build", "prt \\'Host: \\' \\'\\'", "prt $os_host", "cal get_uptime_str", "prt \\'Uptime: \\' \\'\\'", "prt $uptime_str", "jmp end", "", "#normal_mode", "let t_color 2  / title color", "let l_color 3  / label color", "let col_offset 23", "", "let cm {}  / color map", "jeq $param $nil use_default_color", "let chars []", "psh $chars \\';\\' \\'c\\' \\'o\\' \\'O\\' \\'x\\' \\'k\\' \\'d\\' \\'l\\' \\'N\\'", "#set_color_loop", "pol $chars c", "jeq $c $nil begin", "rnd color 1 256", "put $cm $c $color", "jmp set_color_loop", "", "#use_default_color", "put $cm \\';\\' 238", "put $cm \\'c\\' 240", "put $cm \\'o\\' 242", "put $cm \\'O\\' 244", "put $cm \\'x\\' 246", "put $cm \\'k\\' 248", "put $cm \\'d\\' 250", "put $cm \\'l\\' 252", "put $cm \\'N\\' 254", "", "#begin", "let lines []", "psh $lines \\'xxxxccccOOOOdddd       \\'", "psh $lines \\'xxxxccccOOOOdddd       \\'", "psh $lines \\'OOOO            kkkk   \\'", "psh $lines \\'OOOO            kkkk   \\'", "psh $lines \\'dddd::::ooooxxxx       \\'", "psh $lines \\'dddd::::ooooxxxx       \\'", "psh $lines \\'kkkk            llll   \\'", "psh $lines \\'kkkk            llll   \\'", "psh $lines \\'oooo            kkkk   \\'", "psh $lines \\'oooo            kkkk   \\'", "", "len $lines logo_height", "", "#loop_line", "pol $lines line", "jeq $line $nil fin", " #loop_char", " pol $line c", " jeq $c \\'\\' line_done", " get $cm $c color", " lib \\'term.color_print\\' $c $color $nil", " jmp loop_char", " #line_done", "prt \\'\\'", "jmp loop_line", "#fin", "", "let i 0", "#rewind_loop", "jeq $i $logo_height rewind_done", "lib \\'term.prev_line\\'", "add i $i 1", "jmp rewind_loop", "#rewind_done", "", "let line_count 0", "", "def offset", " lib \\'term.move_cursor\\' $col_offset 0", " add line_count $line_count 1", "end", "", "cal offset", "lib \\'term.color_print\\' $username $t_color $nil", "prt \\'\\'", "cal offset", "prt \\'------------\\'", "cal offset", "", "lib \\'term.color_print\\' \\'OS: \\' $l_color $nil", "prt $os_name", "cal offset", "lib \\'term.color_print\\' \\'OS Ver: \\' $l_color $nil", "prt $os_ver", "cal offset", "lib \\'term.color_print\\' \\'OS Build: \\' $l_color $nil", "prt $os_build", "cal offset", "lib \\'term.color_print\\' \\'Host: \\' $l_color $nil", "prt $os_host", "cal offset", "", "lib \\'term.get_height\\' h", "lib \\'term.get_width\\' w", "lib \\'term.color_print\\' \\'Term Size: \\' $l_color $nil", "prt $w \\'x\\'", "prt $h", "cal offset", "", "def get_uptime_str", " lib \\'os.get_sys_info\\' info", " get $info \\'uptime\\' uptime", " div uptime $uptime 1000", " let uptime_str \\'\\'", " div days $uptime 86400", " mod uptime $uptime 86400", " div hours $uptime 3600", " mod uptime $uptime 3600", " div minutes $uptime 60", " mod uptime $uptime 60", " jeq $days 0 skip_day", " add uptime_str $uptime_str $days", " add uptime_str $uptime_str \\'d \\'", " #skip_day", " jeq $hours 0 skip_hour", " add uptime_str $uptime_str $hours", " add uptime_str $uptime_str \\'h \\'", " #skip_hour", " jeq $minutes 0 skip_minute", " add uptime_str $uptime_str $minutes", " add uptime_str $uptime_str \\'m \\'", " #skip_minute", " add uptime_str $uptime_str $uptime", " add uptime_str $uptime_str \\'s\\'", "end", "", "cal get_uptime_str", "lib \\'term.color_print\\' \\'Uptime: \\' $l_color $nil", "prt $uptime_str", "", "sub emp_line_count $logo_height $line_count", "let i 0", "#next_line_loop", "jeq $i $emp_line_count end", "prt \\'\\'", "add i $i 1", "jmp next_line_loop", "", "#end"], "programs": [["exe", "show available programs"], "lib \\'util.get_path_by_str\\' \\'/programs\\' path", "lib \\'os.get_file_list\\' $path lst", "#loop", "pol $lst f", "jeq $f $nil end", "lib \\'os.get_file_type\\' $path $f ft", "jne $ft \\'exe\\' loop", "prt $f \\'\\'", "prt \\' - \\' \\'\\'", "lib \\'os.read_file\\' $path $f fc", "get $fc 0 file_meta", "get $file_meta 1 file_desc", "prt $file_desc", "jmp loop", "#end"], "pwd": [["exe", "return working directory name"], "lib \\'os.get_current_path\\' path", "let path_str \\'/\\'", "#loop", "pol $path d", "jeq $d $nil done", "add path_str $path_str $d", "add path_str $path_str \\'/\\'", "jmp loop", "#done", "prt $path_str"], "quote": [["exe", "get a random quote"], "let req {}", "put $req \\'method\\' \\'GET\\'", "put $req \\'url\\' \\'https://api.quotable.io/quotes/random\\'", "lib \\'net.http\\' $req res", "get $res 0 first", "get $first \\'content\\' quote", "prt $quote", "prt \\' - \\' \\'\\'", "get $first \\'author\\' author", "prt $author"], "rm": [["exe", "remove a file or directory entry"], "let path_str $0", "jeq $path_str $nil print_error_invalid_name", "lib \\'util.get_path_by_str\\' $path_str path", "pop $path file", "lib \\'util.get_real_path\\' $path path", "jeq $path $nil print_error_invalid_path", "psh $path $file", "lib \\'util.verify_path\\' $path 1 is_valid", "jeq $is_valid 0 print_error_invalid_path", "lib \\'os.delete_path\\' $path", "jmp done", "#print_error_invalid_name", "prt \\'USAGE rm file/directory\\'", "jmp done", "#print_error_invalid_path", "prt \\'ERR No such file/directory\\'", "#done"], "rundis": [["exe", "a Redis CLI emulator"], "/ https://runtime.siwei.dev/?src=rundis", "let data {}", "", "let TITLE \\'Rundis v0.1\\'", "let MESSAGE \\'Type <help> to see the available commands.\\'", "", "let WRONG_TYPE \\'WRONG_TYPE Operation against a key holding the wrong kind of value\\'", "let WRONG_ARG \\'ERR value is not an integer or out of range\\'", "", "def set", " let _content {}", " put $_content \\'type\\' \\'string\\'", " put $_content \\'expire\\' 0", " put $_content \\'value\\' $1", " put $data $0 $_content", "end", "", "def get", " let _key $0", " get $data $_key _content", " ife $_content $nil", "  ret $nil", " fin", " cal check_expire $_key", " ife $ret 0", "  ret $nil", " fin", " get $_content \\'type\\' _t", " ife $_t \\'string\\'", "  get $_content \\'value\\' _val", "  add _val \\'\\\\"\\' $_val", "  add _val $_val \\'\\\\"\\'", "  ret $_val", " els", "  ret $WRONG_TYPE", " fin", "end", "", "def push", " let _key $0", " let _val $1", " let _type $2   / 0: lpush, 1: rpush", " let _extra $3", " get $data $_key _content", " ife $_content $nil", "  jmp new_list", " fin", " cal check_expire $_key", " ife $ret 0", "  jmp new_list", " fin", " get $_content \\'type\\' _t", " ife $_t \\'list\\'", "  jmp update_list", " els", "  ret $WRONG_TYPE", " fin", " #new_list", "  let _content {}", "  put $_content \\'type\\' \\'list\\'", "  put $_content \\'expire\\' 0", "  put $_content \\'list_l\\' []", "  put $_content \\'list_r\\' []", "  let _len 0", "  let _list []", "  psh $_list $_val", "  add _len $_len 1", "  #push1", "  pol $_extra _v", "  jeq $_v $nil push1_end", "  psh $_list $_v", "  add _len $_len 1", "  jmp push1", "  #push1_end", "  ife $_type 0", "   put $_content \\'list_l\\' $_list", "  els", "   put $_content \\'list_r\\' $_list", "  fin", "  put $_content \\'length\\' $_len", "  put $data $_key $_content", "  ret $_len", " #update_list", "  get $_content \\'length\\' _len", "  ife $_type 0", "   / lpush", "   get $_content \\'list_l\\' _list_l", "   psh $_list_l $_val", "   add _len $_len 1", "   #push2", "   pol $_extra _v", "   jeq $_v $nil push2_end", "   psh $_list_l $_v", "   add _len $_len 1", "   jmp push2", "   #push2_end", "  els", "   / rpush", "   get $_content \\'list_r\\' _list_r", "   psh $_list_r $_val", "   add _len $_len 1", "   #push3", "   pol $_extra _v", "   jeq $_v $nil push3_end", "   psh $_list_r $_v", "   add _len $_len 1", "   jmp push3", "   #push3_end", "  fin", "  put $_content \\'length\\' $_len", "  ret $_len", "end", "", "def pop", " let _key $0", " let _type $1 / 0: lpop, 1: rpop", " get $data $_key _content", " ife $_content $nil", "  ret $nil", " fin", " cal check_expire $_key", " ife $ret 0", "  ret $nil", " fin", " get $_content \\'type\\' _t", " ife $_t \\'list\\'", "  jmp pop_list", " els", "  ret $WRONG_TYPE", " fin", " #pop_list", " get $_content \\'list_l\\' _list_l", " get $_content \\'list_r\\' _list_r", " ife $_type 0", "  / lpop", "  pop $_list_l _val", "  ife $_val $nil", "   pol $_list_r _val", "  fin", " els", "  / rpop", "  pop $_list_r _val", "  ife $_val $nil", "   pol $_list_l _val", "  fin", " fin", " get $_content \\'length\\' _len", " sub _len $_len 1", " put $_content \\'length\\' $_len", " add _val \\'\\\\"\\' $_val", " add _val $_val \\'\\\\"\\'", " ife $_len 0", "  cal del $_key", " fin", " ret $_val", "end", "", "def len", " let _key $0", " get $data $0 _content", " ife $_content $nil", "  ret 0", " fin", " cal check_expire $_key", " ife $ret 0", "  ret 0", " fin", " get $_content \\'type\\' _t", " ife $_t \\'list\\'", "  jmp get_list_len", " els", "  ret $WRONG_TYPE", " fin", " #get_list_len", " get $_content \\'length\\' _len", " ret $_len", "end", "", "def range", " let _key $0", " get $data $0 _content", " ife $_content $nil", "  prt \\'(empty list or set)\\'", "  ret $nil", " fin", " cal check_expire $_key", " ife $ret 0", "  prt \\'(empty list or set)\\'", "  ret $nil", " fin", " get $_content \\'type\\' _t", " ife $_t \\'list\\'", "  jmp get_list", " els", "  prt $WRONG_TYPE", "  ret $nil", " fin", " #get_list", " get $_content \\'list_l\\' _list_l", " let _tmp_l []", " get $_content \\'list_r\\' _list_r", " let _tmp_r []", " let _res []", " #get_left", " pop $_list_l _v", " jeq $_v $nil done_left", " psh $_res $_v", " psh $_tmp_l $_v", " jmp get_left", " #done_left", " let _rev_tmp_l []", " #rev_l", " pop $_tmp_l _v", " jeq $_v $nil done_rev_l", " psh $_rev_tmp_l $_v", " jmp rev_l", " #done_rev_l", " put $_content \\'list_l\\' $_rev_tmp_l", " #get_right", " pol $_list_r _v", " jeq $_v $nil finish", " psh $_res $_v", " psh $_tmp_r $_v", " jmp get_right", " #finish", " put $_content \\'list_r\\' $_tmp_r", " get $_content \\'length\\' _len", " psh $_res $_len", " ret $_res / its last value is length", "end", "", "def exists", " get $data $0 _content", " ife $_content $nil", "  ret 0", " fin", " cal check_expire $0", " ife $ret 0", "  ret 0", " fin", " ret 1", "end", "", "def del", " del $data $0", "end", "", "def incr", " get $data $0 _content", " ife $_content $nil", "  cal set $0 1", "  ret 1", " fin", " cal check_expire $0", " ife $ret 0", "  cal set $0 1", "  ret 1", " fin", " get $_content \\'value\\' val", " int _new_val $val", " ife $_new_val $nil", "  ret \\'ERR value is not an integer or out of range\\'", " fin", " add _new_val $_new_val 1", " put $_content \\'value\\' $_new_val", " ret $_new_val", "end", "", "def decr", " get $data $0 _content", " ife $_content $nil", "  cal set $0 -1", "  ret -1", " fin", " cal check_expire $0", " ife $ret 0", "  cal set $0 -1", "  ret -1", " fin", " get $_content \\'value\\' val", " int _new_val $val", " ife $_new_val $nil", "  ret \\'ERR value is not an integer or out of range\\'", " fin", " sub _new_val $_new_val 1", " put $_content \\'value\\' $_new_val", " ret $_new_val", "end", "", "def expire", " get $data $0 _content", " ife $_content $nil", "  ret 0", " fin", " cal check_expire $0", " ife $ret 0", "  ret 0", " fin", " tim _now now", " int _sec $1", " ife $_sec $nil", "  ret $WRONG_ARG", " fin", " ife $2 1    / pexpire", "  add _new_expire $_now $_sec", " els            / expire", "  mul _milli $_sec 1000", "  add _new_expire $_now $_milli", " fin", " put $_content \\'expire\\' $_new_expire", " ret 1", "end", "", "def ttl", " get $data $0 _content", " ife $_content $nil", "  ret -2", " fin", " cal check_expire $0", " ife $ret 0", "  ret -2", " fin", " get $_content \\'expire\\' _expire", " ife $_expire 0", "  ret -1", " fin", " tim _now now", " sub _diff $_expire $_now", " ife $1 0     / ttl", "  div _diff $_diff 1000", " fin", " ret $_diff", "end", "", "def persist", " get $data $0 _content", " ife $_content $nil", "  ret 0", " fin", " cal check_expire $0", " ife $ret 0", "  ret 0", " fin", " get $_content \\'expire\\' _expire", " ife $_expire 0", "  ret 0", " fin", " put $_content \\'expire\\' 0", " ret 1", "end", "", "def check_expire", " / assert key exists", " get $data $0 _content", " get $_content \\'expire\\' _expire", " ife $_expire 0", "  ret 1", " fin", " tim _now now", " ifg $_now $_expire", "  cal del $0", "  ret 0 / expired", " fin", " ret 1", "end", "", "def wrong_num_arg", " add str \\'ERR wrong number of arguments for <\\' $0", " add str $str \\'> command\\'", " prt $str", "end", "", "def print_list", " / ** this func will consume the input list **", " let _list $0", " int _start $1", " int _end $2", " let _len $3 / -1 for printing all", " ifg $_len 0", "  ifg 0 $_start", "    add _start $_len $_start", "    ifg 0 $_start", "     let _start 0", "    fin", "  fin", "  ifg 0 $_end", "    add _end $_len $_end", "    ifg 0 $_end", "    let _end -1", "    fin", "  fin", " fin", " let _i 0", " let _idx 1", " let _empty 1", " jeq $_len -1 start_print / print all", " jlt $_start $_len find_start", " ret 0", " #find_start", " ife $_i $_start", "  jmp start_print", " fin", " pol $_list _v", " jeq $_v $nil done_print", " add _i $_i 1", " jmp find_start", " #start_print", " ifg $_end 0", "  jgt $_i $_end done_print", " fin", " pol $_list _val", " jeq $_val $nil done_print", " add _i $_i 1", " ifg $_end 0", "  jgt $_i $_len done_print", " fin", " add _v $_idx \\') \\\\"\\'", " add _v $_v $_val", " add _v $_v \\'\\\\"\\'", " prt $_v", " let _empty 0", " add _idx $_idx 1", " jmp start_print", " #done_print", " ife $_empty 1", "  ret 0", " els", "  ret 1", " fin", "end", "", "def parse_input", " let tokens []", " #next_token", " let token \\'\\'", " #parse_token", " pol $input c", " jeq $c \\'\\' parse_done", " jeq $c \\' \\' token_done", " jeq $c \\'\\\\"\\' parse_string", " jmp add_token_char", "", " #parse_string", " let q $c", " let s \\'\\'", " #parse_string_char", " pol $input c", " ife $c $q", "  psh $tokens $s", "  jmp next_token", " els", "  psh $s $c", "  jmp parse_string_char", " fin", "", " #add_token_char", " add token $token $c", " jmp parse_token", " #token_done", " ife $token \\'\\'", "  jmp next_token", " els", "  psh $tokens $token", " fin", " jmp next_token", " #parse_done", " ife $token \\'\\'", "  ret", " fin", " psh $tokens $token", "end", "", "prt $TITLE", "prt $MESSAGE", "", "#loop", "prt \\'> \\' \\'\\'", "inp input", "jeq $input \\'quit\\' exit", "", "cal parse_input", "pol $tokens cmd", "", "ife $cmd $nil", " jmp loop", "fin", "/ ----- SET -----", "ife $cmd \\'set\\'", " pol $tokens key", " pol $tokens val", " ife $val $nil", "  cal wrong_num_arg \\'set\\'", "  jmp loop", " fin", " cal set $key $val", " prt \\'OK\\'", " jmp loop", "fin", "/ ----- LPUSH -----", "ife $cmd \\'lpush\\'", " pol $tokens key", " pol $tokens val", " ife $val $nil", "  cal wrong_num_arg \\'lpush\\'", "  jmp loop", " fin", " cal push $key $val 0 $tokens", " prt $ret", " jmp loop", "fin", "/ ----- RPUSH -----", "ife $cmd \\'rpush\\'", " pol $tokens key", " pol $tokens val", " ife $val $nil", "  cal wrong_num_arg \\'rpush\\'", "  jmp loop", " fin", " cal push $key $val 1 $tokens", " prt $ret", " jmp loop", "fin", "/ ----- LPOP -----", "ife $cmd \\'lpop\\'", " pol $tokens key", " ife $key $nil", "  cal wrong_num_arg \\'lpop\\'", "  jmp loop", " fin", " cal pop $key 0", " ife $ret $nil", "  prt \\'(nil)\\'", " els", "  prt $ret", " fin", " jmp loop", "fin", "/ ----- RPOP -----", "ife $cmd \\'rpop\\'", " pol $tokens key", " ife $key $nil", "  cal wrong_num_arg \\'rpop\\'", "  jmp loop", " fin", " cal pop $key 1", " ife $ret $nil", "  prt \\'(nil)\\'", " els", "  prt $ret", " fin", " jmp loop", "fin", "/ ----- LLEN -----", "ife $cmd \\'llen\\'", " pol $tokens key", " ife $key $nil", "  cal wrong_num_arg \\'llen\\'", "  jmp loop", " fin", " cal len $key", " prt $ret", " jmp loop", "fin", "/ ----- LRANGE -----", "ife $cmd \\'lrange\\'", " pol $tokens key", " pol $tokens start", " pol $tokens end", " ife $end $nil", "  cal wrong_num_arg \\'lrange\\'", "  jmp loop", " fin", " cal range $key", " ife $ret $nil", " els", "  pop $ret len", "  cal print_list $ret $start $end $len", "  ife $ret 0", "   prt \\'(empty list or set)\\'", "  fin", " fin", " jmp loop", "fin", "/ ----- GET -----", "ife $cmd \\'get\\'", " pol $tokens key", " ife $key $nil", "  cal wrong_num_arg \\'get\\'", "  jmp loop", " fin", " cal get $key", " ife $ret $nil", "  prt \\'(nil)\\'", " els", "  prt $ret", " fin", " jmp loop", "fin", "/ ----- EXISTS -----", "ife $cmd \\'exists\\'", " pol $tokens key", " ife $key $nil", "  cal wrong_num_arg \\'exists\\'", "  jmp loop", " fin", " cal exists $key", " prt $ret", " jmp loop", "fin", "/ ----- DEL -----", "ife $cmd \\'del\\'", " pol $tokens key", " ife $key $nil", "  cal wrong_num_arg \\'del\\'", "  jmp loop", " fin", " cal del $key", " prt \\'OK\\'", " jmp loop", "fin", "ife $cmd \\'ping\\'", " prt \\'PONG\\'", " jmp loop", "fin", "/ ----- INCR -----", "ife $cmd \\'incr\\'", " pol $tokens key", " ife $key $nil", "  cal wrong_num_arg \\'incr\\'", "  jmp loop", " fin", " cal incr $key", " prt $ret", " jmp loop", "fin", "/ ----- DECR -----", "ife $cmd \\'decr\\'", " pol $tokens key", " ife $key $nil", "  cal wrong_num_arg \\'decr\\'", "  jmp loop", " fin", " cal decr $key", " prt $ret", " jmp loop", "fin", "/ ----- EXPIRE -----", "ife $cmd \\'expire\\'", " pol $tokens key", " pol $tokens sec", " ife $sec $nil", "  cal wrong_num_arg \\'expire\\'", "  jmp loop", " fin", " cal expire $key $sec 0", " prt $ret", " jmp loop", "fin", "/ ----- PEXPIRE -----", "ife $cmd \\'pexpire\\'", " pol $tokens key", " pol $tokens millisec", " ife $millisec $nil", "  cal wrong_num_arg \\'pexpire\\'", "  jmp loop", " fin", " cal expire $key $millisec 1", " prt $ret", " jmp loop", "fin", "/ ----- SETEX -----", "ife $cmd \\'setex\\'", " pol $tokens key", " pol $tokens sec", " pol $tokens val", " ife $val $nil", "  cal wrong_num_arg \\'setex\\'", "  jmp loop", " fin", " cal set $key $val", " cal expire $key $sec 0", " prt $ret", " jmp loop", "fin", "/ ----- TTL -----", "ife $cmd \\'ttl\\'", " pol $tokens key", " ife $key $nil", "  cal wrong_num_arg \\'ttl\\'", "  jmp loop", " fin", " cal ttl $key 0", " prt $ret", " jmp loop", "fin", "/ ----- PTTL -----", "ife $cmd \\'pttl\\'", " pol $tokens key", " ife $key $nil", "  cal wrong_num_arg \\'pttl\\'", "  jmp loop", " fin", " cal ttl $key 1", " prt $ret", " jmp loop", "fin", "/ ----- PERSIST -----", "ife $cmd \\'persist\\'", " pol $tokens key", " ife $key $nil", "  cal wrong_num_arg \\'persist\\'", "  jmp loop", " fin", " cal persist $key", " prt $ret", " jmp loop", "fin", "/ ----- ECHO -----", "ife $cmd \\'echo\\'", " pol $tokens msg", " add msg \\'\\\\"\\' $msg", " add msg $msg \\'\\\\"\\'", " prt $msg", " jmp loop", "fin", "/ ----- DATA -----", "ife $cmd \\'data\\'", " prt $data", " jmp loop", "fin", "/ ----- KEYS -----", "ife $cmd \\'keys\\'", " key $data keys", " cal print_list $keys 0 -1 -1", " jmp loop", "fin", "/ ----- FLUSHALL -----", "ife $cmd \\'flushall\\'", " let data {}", " jmp loop", "fin", "/ ----- HELP -----", "ife $cmd \\'help\\'", " prt \\'Supported commands:\\'", " prt \\'data decr del echo exists expire flushall get incr keys llen lpop lpush lrange persist pexpire ping pttl quit rpop rpush set setex ttl\\'", " jmp loop", "fin", "add err \\'ERR unknown command: \\' $cmd", "prt $err", "jmp loop", "", "#exit", "prt \\'bye\\'"], "shell": [["exe", "a shell"], "prt \\'Runtime Shell v1.0 (beta)\\'", "prt \\'Type <help> for more info, <exit> to quit\\'", "", "rnd sid 1000 9999", "", "#main_loop", "prt \\'[\\' \\'\\'", "prt $sid \\']\\'", "prt \\'> \\' \\'\\'", "inp raw_input", "", "let cmd \\'\\'", "let prog_name_done 0", "let prog_with_path 0", "#pre_process", "pol $raw_input c", "jeq $c \\'\\' pre_process_done", "jne $c \\' \\' continue", "jeq $cmd \\'\\' pre_process", "let prog_name_done 1", "#continue", "jne $c \\'/\\' push_char", "jeq $prog_name_done 1 push_char", "let prog_with_path 1", "#push_char", "psh $cmd $c", "jmp pre_process", "#pre_process_done", "", "#remove_trailing_space", "pop $cmd c", "jeq $c \\' \\' remove_trailing_space", "psh $cmd $c", "", "jeq $cmd \\'\\' main_loop", "jeq $cmd \\'exit\\' exit", "jeq $cmd \\'help\\' help", "", "jeq $prog_with_path 1 execute_prog", "add cmd \\'/programs/\\' $cmd", "#execute_prog", "lib \\'os.execute\\' $cmd", "jmp main_loop", "", "#help", "prt \\'Available programs:\\'", "let prog_path []", "psh $prog_path \\'programs\\'", "lib \\'os.get_file_list\\' $prog_path prog_list", "#print_prog_names_loop", "pol $prog_list prog_name", "jeq $prog_name $nil print_prog_names_done", "prt $prog_name \\' \\'", "jmp print_prog_names_loop", "#print_prog_names_done", "prt \\'\\'", "jmp main_loop", "", "#exit"], "slow_print": [["exe", "print a message character by character"], "let msg \\'Hello World!\\'", "jeq $0 $nil continue", "let msg $0", "#continue", "#loop", "pol $msg c", "jeq $c \\'\\' done", "slp 100", "prt $c \\'\\'", "jmp loop", "#done", "prt \\'\\'"], "sync": [["exe", "sync user files with remote server"], "let AUTH_API \\'https://siwei.dev\\'", "add API_SESSION $AUTH_API \\'/session\\'", "add API_SAVE_FILE $AUTH_API \\'/api/fs/save\\'", "", "def build_req", " let _method $0", " let _url $1", " let _data $2", " let _with_credential $3", " let _req {}", " put $_req \\'method\\' $_method", " put $_req \\'url\\' $_url", " jeq $_data $nil skip_data", "  put $_req \\'data\\' $_data", " #skip_data", " ife $_with_credential 1", "  put $_req \\'with_credential\\' 1", " fin", " ret $_req", "end", "", "/ check existing session", "cal build_req \\'POST\\' $API_SESSION $nil 1", "lib \\'net.http\\' $ret res", "get $res \\'status\\' status", "jeq $status \\'1\\' error_not_logged_in", "get $res \\'username\\' session_username", "lib \\'os.get_env_var\\' \\'user\\' current_user", "jne $session_username $current_user error_login_status", "", "/ save files", "prt \\'Saving files...\\' \\'\\'", "let home_dir []", "psh $home_dir \\'home\\'", "lib \\'os.read_file\\' $home_dir $current_user user_files", "str user_files_str $user_files", "let payload {}", "put $payload \\'data\\' $user_files_str", "cal build_req \\'POST\\' $API_SAVE_FILE $payload 1", "lib \\'net.http\\' $ret res", "get $res \\'status\\' status", "jne $status 0 error_save_file", "prt \\'[done]\\'", "", "jmp end", "", "#error_save_file", "prt \\'[fail]\\'", "prt \\'ERR failed to save files, logout aborted\\'", "jmp end", "", "#error_login_status", "prt \\'ERR invalid login status, please login first\\'", "jmp end", "", "#error_not_logged_in", "prt \\'ERR not logged in\\'", "jmp end", "", "#end"], "tail": [["exe", "display the last part of a file"], "let path_str $0", "jeq $path_str $nil print_error_invalid_name", "lib \\'util.get_path_by_str\\' $path_str path", "pop $path file_name", "lib \\'util.get_real_path\\' $path path", "lib \\'util.verify_path\\' $path 1 is_valid_path", "jeq $is_valid_path 0 print_error_invalid_path", "lib \\'os.read_file\\' $path $file_name file_content", "jeq $file_content $nil print_error_invalid_path", "lib \\'os.get_file_type\\' $path $file_name file_type", "", "let default_len 10", "let line_count 0", "", "jeq $file_type \\'raw\\' raw_file", "jeq $file_type \\'txt\\' file_with_meta", "jeq $file_type \\'exe\\' file_with_meta", "jeq $file_type \\'dir\\' print_error_directory", "typ data_type $file_content", "jeq $data_type \\'list\\' list_file", "jmp unsupported_file_type", "", "#raw_file", "prt $file_content", "jmp done", "", "#file_with_meta", "let i 1", "jmp calculate_start", "", "#list_file", "let i 0", "", "#calculate_start", "len $file_content l", "", "sub j $l $default_len", "jlt $j $i set_first_line", "jmp output", "", "#set_first_line", "let j $i", "", "#output", "get $file_content $j line", "jeq $line $nil done", "prt $line", "add j $j 1", "jmp output", "", "#unsupported_file_type", "prt \\'ERR Unsupported file type\\'", "jmp done", "", "#print_error_invalid_name", "prt \\'USAGE tail file\\'", "jmp done", "", "#print_error_directory", "prt \\'ERR \\\\"\\' \\'\\'", "prt $file_name \\'\\'", "prt \\'\\\\" is a directory\\'", "jmp done", "", "#print_error_invalid_path", "prt \\'ERR File not found\\'", "#done"], "test": [["exe", "for testing"], "lib \\'term.get_width\\' w", "lib \\'term.get_height\\' h", "", "jne $w $nil continue", "prt \\'ERR your current terminal is not supported\\'", "jmp finished", "#continue", "", "prt \\'(w=\\' \\'\\'", "prt $w \\', h=\\'", "prt $h \\')\\'", "prt \\'\\'", "", "prt \\'[\\' \\'\\'", "sub width $w 1", "lib \\'term.move_cursor\\' $width 0", "prt \\']\\' \\'\\'", "", "sub width $width 1", "mul width $width -1", "lib \\'term.move_cursor\\' $width 0", "", "let p 0", "sub total $w 2", "#progress", "jeq $p $total progress_done", "prt \\'=\\' \\'\\'", "add p $p 1", "slp 20", "jmp progress", "#progress_done", "prt \\'\\'", "", "#finished", "", "/ == Test key press ==", "/ #loop", "/ let key $lastkey", "/ jeq $key $nil next", "/ prt $key", "/ #next", "/ slp 100", "/ jmp loop"], "test101": [["exe", "test 101"], "let total 0", "let fail 0", "", "def assert_eq", " let _val $0", " let _exp $1", " typ _val_t $0", " typ _exp_t $1", " jne $_val_t $_exp_t false", " ife $_val_t \\'list\\'", "  len $_val _l1", "  len $_exp _l2", "  jne $_l1 $_l2 false", "  let _i 0", "  #list_loop", "  jeq $_i $_l1 true", "  get $_val $_i _v1", "  get $_exp $_i _v2", "  jne $_v1 $_v2 false", "  add _i $_i 1", "  jmp list_loop", " fin", " jne $_val $_exp false", " #true", " ret 1", " #false", " ret 0", "end", "", "def assert_ne", " let _val $0", " let _exp $1", " cal assert_eq $_val $_exp", " ife $ret 1", "  ret 0", " fin", " ret 1", "end", "", "def is_in_list", " let _val $0", " let _lst $1", " len $_lst _ll", " let _i 0", " #loop", " jeq $_i $_ll false", " get $_lst $_i _cur", " jeq $_cur $_val true", " add _i $_i 1", " jmp loop", " #true", " ret 1", " #false", " ret 0", "end", "", "def new_set", " let _lst $0", " let _res []", " for _a $_lst", "  cal is_in_list $_a $_res", "  ife $ret 0", "   psh $_res $_a", "  fin", " nxt", " ret $_res", "end", "", "def set_equal", " let _s1 $0", " let _s2 $1", " len $_s1 _len1", " len $_s2 _len2", " jne $_len1 $_len2 false", " let _i 0", " #loop", " jeq $_i $_len1 true", " get $_s1 $_i _cur", " cal is_in_list $_cur $_s2", " jeq $ret 0 false", " add _i $_i 1", " jmp loop", " #true", " ret 1", " #false", " ret 0", "end", "", "def count_result", " let _name $0", " let _res $1", " add total $total 1", " ife $_res 1", "  prt \\'[pass]\\' \\' \\'", " els", "  add fail $fail 1", "  prt \\'[*fail]\\' \\' \\'", " fin", " prt $_name", "end", "", "", "/ == Int", "cal assert_eq 1 1", "cal count_result \\'Int eq\\' $ret", "cal assert_ne 1 3", "cal count_result \\'Int not eq\\' $ret", "", "", "/ == Arithmetic operations", "let a 12", "let b 9", "add c $a $b", "cal assert_eq $c 21", "cal count_result \\'Arith add int & int\\' $ret", "add r \\'ab\\' \\'cd\\'", "cal assert_eq $r \\'abcd\\'", "cal count_result \\'Arith add str & str\\' $ret", "add r 5 \\'cd\\'", "cal assert_eq $r \\'5cd\\'", "cal count_result \\'Arith add int & str\\' $ret", "add r \\'12\\' 4", "cal assert_eq $r \\'124\\'", "cal count_result \\'Arith add str & int\\' $ret", "add r $nil 65", "cal assert_eq $r \\'A\\'", "cal count_result \\'Arith add itoa\\' $ret", "sub c $a $b", "cal assert_eq $c 3", "cal count_result \\'Arith sub\\' $ret", "sub r \\'b\\' $nil", "cal assert_eq $r 98", "cal count_result \\'Arith sub atoi\\' $ret", "mul c $a $b", "cal assert_eq $c 108", "cal count_result \\'Arith mul\\' $ret", "mul r \\'ab\\' 3", "cal assert_eq $r \\'ababab\\'", "cal count_result \\'Arith mul str\\' $ret", "div c $a $b", "cal assert_eq $c 1", "cal count_result \\'Arith div\\' $ret", "mod c $a $b", "cal assert_eq $c 3", "cal count_result \\'Arith mod\\' $ret", "", "", "/ == Type", "let a 34", "typ t1 $a", "cal assert_eq $t1 \\'int\\'", "cal count_result \\'Type int\\' $ret", "let b \\'34\\'", "typ t $b", "cal assert_eq $t \\'str\\'", "cal count_result \\'Type str\\' $ret", "let c []", "typ t $c", "cal assert_eq $t \\'list\\'", "cal count_result \\'Type list\\' $ret", "let d {}", "typ t $d", "cal assert_eq $t \\'map\\'", "cal count_result \\'Type map\\' $ret", "cal assert_ne 123 \\'123\\'", "cal count_result \\'Type compare int & str\\' $ret", "", "", "/ == List", "let list_1 []", "cal assert_eq $list_1 []", "cal count_result \\'List empty\\' $ret", "", "psh $list_1 23", "cal assert_ne $list_1 []", "cal count_result \\'List not empty\\' $ret", "", "psh $list_1 45", "psh $list_1 56", "let list_2 []", "psh $list_2 23 45 56", "cal assert_eq $list_1 $list_2", "cal count_result \\'List push\\' $ret", "", "len $list_1 lenght", "cal assert_eq $lenght 3", "cal count_result \\'List length\\' $ret", "", "get $list_1 1 val", "cal assert_eq $val 45", "cal count_result \\'List get\\' $ret", "put $list_1 2 70", "let list_2 []", "psh $list_2 23 45 70", "cal assert_eq $list_1 $list_2", "cal count_result \\'List put\\' $ret", "", "pol $list_1 val", "cal assert_eq $val 23", "cal count_result \\'List pol 1\\' $ret", "let empty_list []", "pol $empty_list val", "cal assert_eq $val $nil", "cal count_result \\'List pol 2\\' $ret", "pop $list_1 val", "cal assert_eq $val 70", "cal count_result \\'List pop 1\\' $ret", "pop $list_1 val", "cal assert_eq $val 45", "cal count_result \\'List pop 2\\' $ret", "pop $list_1 val", "cal assert_eq $val $nil", "cal count_result \\'List pop 3\\' $ret", "", "", "/ == String", "let s1 \\'abcde\\'", "psh $s1 \\'f\\'", "cal assert_eq $s1 \\'abcdef\\'", "cal count_result \\'String push 1\\' $ret", "psh $s1 \\'g\\' \\'h\\' \\'i\\'", "cal assert_eq $s1 \\'abcdefghi\\'", "cal count_result \\'String push 2\\' $ret", "psh $s1 \\'jkl\\'", "cal assert_eq $s1 \\'abcdefghijkl\\'", "cal count_result \\'String push 3\\' $ret", "pop $s1 c", "pop $s1 c", "pop $s1 c", "cal assert_eq $c \\'j\\'", "cal count_result \\'String pop\\' $ret", "len $s1 length", "cal assert_eq $length 9", "cal count_result \\'String len\\' $ret", "get $s1 6 c", "cal assert_eq $c \\'g\\'", "cal count_result \\'String get\\' $ret", "get $s1 99 c", "cal assert_eq $c \\'\\'", "cal count_result \\'String get invalid\\' $ret", "put $s1 2 \\'X\\'", "cal assert_eq $s1 \\'abXdefghi\\'", "cal count_result \\'String put\\' $ret", "let s2 \\'123\\'", "let s3 \\'run\\'", "add s4 $s2 $s3", "cal assert_eq $s4 \\'123run\\'", "cal count_result \\'String add\\' $ret", "pol $s4 c", "pol $s4 c", "cal assert_eq $c \\'2\\'", "cal count_result \\'String poll 1\\' $ret", "cal assert_eq $s4 \\'3run\\'", "cal count_result \\'String poll 2\\' $ret", "let empty_str \\'\\'", "pol $empty_str c", "cal assert_eq $c \\'\\'", "cal count_result \\'String poll 3\\' $ret", "", "", "/ == Map", "let m {}", "put $m \\'a\\' 12", "put $m \\'b\\' \\'23\\'", "get $m \\'a\\' val", "cal assert_eq $val 12", "cal count_result \\'Map get 1\\' $ret", "get $m \\'b\\' val", "cal assert_eq $val \\'23\\'", "cal count_result \\'Map get 2\\' $ret", "get $m \\'c\\' val", "cal assert_eq $val $nil", "cal count_result \\'Map get nil\\' $ret", "put $m \\'a\\' \\'aa\\'", "get $m \\'a\\' val", "cal assert_eq $val \\'aa\\'", "cal count_result \\'Map get replaced\\' $ret", "len $m length", "cal assert_eq $length 2", "cal count_result \\'Map length\\' $ret", "key $m keys", "let lst []", "psh $lst \\'a\\' \\'b\\'", "cal assert_eq $keys $lst", "cal count_result \\'Map keys\\' $ret", "del $m \\'b\\'", "get $m \\'b\\' val", "cal assert_eq $val $nil", "cal count_result \\'Map get deleted\\' $ret", "", "", "/ == Parse JSON", "prs j1 \\'{\\\\"k1\\\\": 123, \\\\"k2\\\\": \\\\"abc\\\\", \\\\"k3\\\\": null}\\'", "get $j1 \\'k1\\' val", "cal assert_eq $val 123", "cal count_result \\'Parse JSON get int\\' $ret", "get $j1 \\'k2\\' val", "cal assert_eq $val \\'abc\\'", "cal count_result \\'Parse JSON get string\\' $ret", "get $j1 \\'k3\\' val", "cal assert_eq $val $nil", "cal count_result \\'Parse JSON get nil\\' $ret", "prs j2 \\'{\\\\"list\\\\": [1,2,\\\\"ab\\\\"]}\\'", "get $j2 \\'list\\' lst1", "let lst2 []", "psh $lst2 1 2 \\'ab\\'", "cal assert_eq $lst1 $lst2", "cal count_result \\'Parse JSON get list\\' $ret", "prs j3 \\'{\\\\"list\\\\":[1,2,[[],null,\\\\"aa\\\\"]]}\\'", "get $j3 \\'list\\' lst", "get $lst 2 inner_lst", "let lst2 []", "psh $lst2 [] $nil \\'aa\\'", "cal assert_eq $inner_lst $lst2", "cal count_result \\'Parse JSON inner list\\' $ret", "prs j4 \\'{\\\\"aa\\\\":{\\\\"bb\\\\":[{\\\\"cc\\\\":123}]}}\\'", "get $j4 \\'aa\\' im1", "get $im1 \\'bb\\' il1", "get $il1 0 im2", "get $im2 \\'cc\\' val", "cal assert_eq $val 123", "cal count_result \\'Parse JSON inner map\\' $ret", "", "", "// == If-else", "let a 5", "let b 8", "let c 5", "let v 0", "", "ife $a $b", " let v 1", "fin", "cal assert_eq $v 0", "cal count_result \\'If equal false\\' $ret", "", "ife $c $a", " let v 5", "fin", "cal assert_eq $v 5", "cal count_result \\'If equal true\\' $ret", "", "ife $b $a", " let v 6", "els", " let v 7", "fin", "cal assert_eq $v 7", "cal count_result \\'If equal else\\' $ret", "", "ifg $a $c", " let v 10", "els", " let v 11", "fin", "cal assert_eq $v 11", "cal count_result \\'If greater else\\' $ret", "", "ifg $b $c", " let v 12", "els", " let v 13", "fin", "cal assert_eq $v 12", "cal count_result \\'If greater true\\' $ret", "", "", "/ == For loop", "let lst []", "psh $lst 12 \\'ss\\' $nil \\'ab\\'", "let res []", "for item $lst", " psh $res $item", "nxt", "cal assert_eq $lst $res", "cal count_result \\'For loop list\\' $ret", "", "let res []", "for v 3", " psh $res $v", "nxt", "let exp []", "psh $exp 0 1 2", "cal assert_eq $res $exp", "cal count_result \\'For loop int range\\' $ret", "", "let m {}", "put $m \\'a\\' 4", "put $m \\'k\\' 9", "let res []", "for v $m", " psh $res $v", "nxt", "let exp []", "psh $exp \\'a\\' \\'k\\'", "cal set_equal $res $exp", "cal assert_eq $ret 1", "cal count_result \\'For loop map\\' $ret", "", "", "prt \\'============\\'", "prt \\'Total \\' \\'\\'", "sub pass $total $fail", "prt $pass \\'/\\'", "prt $total", "prt \\'Failed \\' \\'\\'", "prt $fail"], "test_led": [["exe", "test led"], "lib \\'dev.set_led\\' 0 1", "slp 200", "lib \\'dev.set_led\\' 1 1", "slp 200", "lib \\'dev.set_led\\' 2 1", "slp 500", "lib \\'dev.set_led\\' 0 0", "slp 200", "lib \\'dev.set_led\\' 1 0", "slp 200", "lib \\'dev.set_led\\' 2 0"], "timer": [["exe", "a countdown timer"], "let len_str $0", "jeq $len_str $nil err_invalid_param", "", "let map {}", "put $map \\'s\\' 1", "put $map \\'m\\' 60", "put $map \\'h\\' 3600", "", "pop $len_str unit", "get $map $unit unit_len", "", "int num $len_str", "mul total $unit_len $num", "", "tim now now", "div now $now 1000", "add future $now $total", "", "/ show current time", "prt \\'Timer started at \\' \\'\\'", "tim h hour", "tim m minute", "tim s second", "jgt $h 9 show_hour", "prt \\'0\\' \\'\\'", "#show_hour", "prt $h \\':\\'", "jgt $m 9 show_minute", "prt \\'0\\' \\'\\'", "#show_minute", "prt $m \\':\\'", "jgt $s 9 show_second", "prt \\'0\\' \\'\\'", "#show_second", "prt $s", "", "/ timer loop", "lib \\'term.set_prt_delay\\' 0", "prt $total", "#loop", "tim current now", "div current $current 1000", "sub left $future $current", "jlt $left 0 finished", "lib \\'term.prev_line\\'", "lib \\'term.clear_line\\'", "jlt $left 3600 skip_h", "div left_h $left 3600", "prt $left_h \\'h \\'", "#skip_h", "jlt $left 60 skip_m", "mod left_m $left 3600", "div left_m $left_m 60", "prt $left_m \\'m \\'", "#skip_m", "mod left_s $left 60", "prt $left_s \\'s \\'", "prt \\'\\'", "slp 100", "jmp loop", "", "#err_invalid_param", "prt \\'USAGE timer <duration in s/m/h>\\'", "prt \\' e.g. set a 5 minutes timer: timer 5m\\'", "jmp end", "#finished", "lib \\'term.set_prt_delay\\' 1", "prt \\'Done\\'", "#end"], "todo": [["exe", "manage a todo list"], "lib \\'os.get_home_path\\' home_path", "", "lib \\'term.get_height\\' h", "jeq $h $nil err_term_not_supported", "sub h $h 1", "", "lib \\'term.set_prt_delay\\' 0", "lib \\'term.alternate_buffer\\'", "", "def print_header", " cal clear", " prt \\'\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 TODO v1.0 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\\'", " prt \\'\u2502Usage: add <t> / done <i> / exit\u2502\\'", " prt \\'\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\\'", "end", "", "def clear", " let i 0", " #clear_loop", " jeq $i $h clear_done", " lib \\'term.clear_line\\'", " lib \\'term.prev_line\\'", " add i $i 1", " jmp clear_loop", " #clear_done", " lib \\'term.clear_line\\'", " / * BUG: calling lib will clear the primary buffer", " /lib \\'term.clear_screen\\'", "end", "", "cal print_header", "", "#load_data", "lib \\'os.read_file\\' $home_path \\'_todo\\' file_data", "jne $file_data $nil file_loaded", "lib \\'os.write_file\\' $home_path \\'_todo\\' []", "jmp load_data", "#file_loaded", "let todo $file_data", "len $todo size", "", "/ initial print", "let i 0", "#print_todo", "jeq $i $size print_done", "add j $i 1", "prt $j \\'. \\'", "get $todo $i item", "prt $item", "add i $i 1", "jmp print_todo", "#print_done", "", "/ === MAIN LOOP", "#main_loop", "prt \\'>\\' \\'\\'", "inp input", "", "let cmd \\'\\'", "#parse", "pol $input c", "jeq $c \\'\\' parse_done", "jeq $c \\' \\' parse_done", "psh $cmd $c", "jmp parse", "#parse_done", "", "jeq $cmd \\'exit\\' end", "", "let ri -1", "", "jne $cmd \\'add\\' not_add", "psh $todo $input", "len $todo size", "let ri 0", "#not_add", "", "jne $cmd \\'done\\' not_done", "int idx $input", "sub idx $idx 1", "put $todo $idx \\'\\'", "let new_todo []", "#update_done", "pol $todo t", "jeq $t $nil update_done_finish", "jeq $t \\'\\' update_done", "psh $new_todo $t", "jmp update_done", "#update_done_finish", "let todo $new_todo", "#not_done", "", "/ clear screen", "lib \\'term.clear_screen\\'", "cal print_header", "", "len $todo size", "", "let i 0", "#reprint", "jeq $i $size reprint_done", "add j $i 1", "prt $j \\'. \\'", "get $todo $i item", "prt $item", "add i $i 1", "jmp reprint", "#reprint_done", "", "lib \\'term.clear_line\\'", "let ri -1", "jmp main_loop", "/ ^^^ end of MAIN LOOP", "", "#err_term_not_supported", "prt \\'ERR Your current terminal is not supported\\'", "jmp exit", "", "#end", "lib \\'os.write_file\\' $home_path \\'_todo\\' $todo", "lib \\'term.clear_screen\\'", "lib \\'term.primary_buffer\\'", "/prt \\'Bye~\\'", "", "#exit", "lib \\'term.set_prt_delay\\' 1"], "touch": [["exe", "change file timestamps"], "let path_str $0", "jeq $path_str $nil print_error_invalid_name", "lib \\'util.get_path_by_str\\' $path_str path", "pop $path file", "lib \\'util.get_real_path\\' $path path", "jeq $path $nil print_error_invalid_path", "psh $path $file", "lib \\'util.verify_path\\' $path 1 is_valid", "jeq $is_valid 0 create_file", "jmp done", "#print_error_invalid_name", "prt \\'USAGE touch file\\'", "jmp done", "#create_file", "pop $path file", "lib \\'os.write_file\\' $path $file \\'\\'", "jmp done", "#print_error_invalid_path", "prt \\'ERR No such file/directory\\'", "jmp done", "#done"], "tree": [["exe", "list contents of directories in a tree-like format"], "let stack []", "let header []", "let lvl 0", "jeq $0 $nil use_current_path", "lib \\'util.get_path_by_str\\' $0 path", "lib \\'util.get_real_path\\' $path path", "jeq $path $nil print_error_invalid_path", "lib \\'util.verify_path\\' $path 0 is_valid_path", "jeq $is_valid_path 0 print_error_invalid_path", "jmp continue_with_path", "#use_current_path", "lib \\'os.get_current_path\\' path", "lib \\'util.get_real_path\\' $path path", "#continue_with_path", "#routine", "lib \\'os.get_file_list\\' $path lst", "let cur_lst $lst", "#loop", "pol $cur_lst f", "jeq $f $nil end", "lib \\'os.get_file_type\\' $path $f ft", "len $cur_lst cur_len", "let lvl_count 0", "#print_level", "jeq $lvl_count $lvl level_done", "get $header $lvl_count lvl_seg", "prt $lvl_seg \\'\\'", "add lvl_count $lvl_count 1", "jmp print_level", "#level_done", "let header_seg \\'\u2502   \\'", "jeq $cur_len 0 print_last", "prt \\'\u251c\u2500\u2500 \\' \\'\\'", "jmp head_end", "#print_last", "prt \\'\u2514\u2500\u2500 \\' \\'\\'", "let header_seg \\'     \\'", "#head_end", "let line $f", "jne $ft \\'lnk\\' not_link", "lib \\'os.read_file\\' $path $f _f_content", "get $_f_content 0 _f_meta", "get $_f_meta 1 _linked_path", "add line $line \\' -> \\'", "add line $line $_linked_path", "#not_link", "prt $line", "jne $ft \\'dir\\' not_dir", "add lvl $lvl 1", "psh $header $header_seg", "psh $path $f", "psh $stack $f", "jmp routine", "#not_dir", "jmp loop", "#end", "len $stack stack_size", "jeq $stack_size 0 exit", "pop $stack top_f", "sub lvl $lvl 1", "pop $header _", "pop $path _", "lib \\'os.get_file_list\\' $path cur_lst", "#skip_by_stack", "pol $cur_lst cur", "jeq $cur $top_f to_jmp_loop", "jmp skip_by_stack", "#to_jmp_loop", "jmp loop", "", "#print_error_invalid_path", "prt \\'ERR Invalid path\\'", "jmp exit", "#exit"], "uname": [["exe", "print operating system name"], "lib \\'os.get_os_info\\' info", "get $info 0 os_name", "get $info 1 os_ver", "get $info 2 os_build", "prt $os_name \\'\\'", "prt \\'  v\\' \\'\\'", "prt $os_ver \\'\\'", "prt \\' (build \\' \\'\\'", "prt $os_build \\')\\'", "prt \\'\\'"], "uptime": [["exe", "show how long system has been running"], "lib \\'os.get_sys_info\\' info", "get $info \\'uptime\\' uptime", "div uptime $uptime 1000", "tim h hour", "tim m minute", "tim s second", "jgt $h 9 show_hour", "prt \\'0\\' \\'\\'", "#show_hour", "prt $h \\':\\'", "jgt $m 9 show_minute", "prt \\'0\\' \\'\\'", "#show_minute", "prt $m \\':\\'", "jgt $s 9 show_second", "prt \\'0\\' \\'\\'", "#show_second", "prt $s \\' up \\'", "div days $uptime 86400", "mod uptime $uptime 86400", "div hours $uptime 3600", "mod uptime $uptime 3600", "div minutes $uptime 60", "mod uptime $uptime 60", "jeq $days 0 show_time", "prt $days \\' day\\'", "jeq $days 1 single_day", "prt \\'s\\' \\'\\'", "#single_day", "prt \\',\\' \\' \\'", "#show_time", "jgt $hours 9 hour", "prt \\'0\\' \\'\\'", "#hour", "prt $hours \\':\\'", "jgt $minutes 9 minute", "prt \\'0\\' \\'\\'", "#minute", "prt $minutes \\':\\'", "jgt $uptime 9 second", "prt \\'0\\' \\'\\'", "#second", "prt $uptime"], "v": [["exe", "view file contents"], "lib \\'term.get_height\\' h", "lib \\'term.get_width\\' w", "jeq $h $nil err_term_not_supported", "sub h $h 1", "", "let path_str $0", "jeq $path_str $nil print_usage", "lib \\'util.get_path_by_str\\' $path_str path", "jeq $path $nil print_error_invalid_file", "pop $path file_name", "lib \\'util.get_real_path\\' $path path", "jeq $path $nil print_error_invalid_file", "lib \\'os.read_file\\' $path $file_name file_content", "jeq $file_content $nil print_error_invalid_file", "lib \\'os.get_file_type\\' $path $file_name file_type", "", "/jeq $file_type \\'raw\\' raw_file", "jeq $file_type \\'txt\\' txt_file", "jeq $file_type \\'exe\\' exe_file", "jeq $file_type \\'bat\\' exe_file", "jeq $file_type \\'dir\\' print_error_directory", "typ data_type $file_content", "jeq $data_type \\'list\\' list_file", "jmp unsupported_file_type", "", "#raw_file", "prt $file_content", "jmp done", "", "#txt_file", "let start_i 1", "jmp show_content", "", "#list_file", "let start_i 0", "jmp show_content", "", "#exe_file", "let start_i 1", "jmp show_content", "", "#show_content", "", "lib \\'term.set_prt_delay\\' 0", "lib \\'term.alternate_buffer\\'", "", "def clear", "/  let i 0", "/  #clear_loop", "/  jeq $i $h clear_done", "/  lib \\'term.clear_line\\'", "/  lib \\'term.prev_line\\'", "/  add i $i 1", "/  jmp clear_loop", "/  #clear_done", "/  lib \\'term.clear_line\\'", " lib \\'term.clear_screen\\'", "end", "", "let top_ln 1", "let reached_end 0", "", "#loop", "let i 0", "let max_ln $h", "sub line_max $w 4", "add line_max_1 $line_max 1", "let displayed_ln 0", "let wrap_ln 0", "", "#content_loop", "jeq $i $max_ln content_done", "let ln_block \\'\\'", "add ln $i $top_ln", "jgt $ln 9 skip_1_indent", "add ln_block $ln_block \\' \\'", "#skip_1_indent", "jgt $ln 99 skip_2_indent", "add ln_block $ln_block \\' \\'", "#skip_2_indent", "add ln_block $ln_block $ln", "add ln_block $ln_block \\' \\'", "lib \\'term.color_print\\' $ln_block $nil 239", "sub li $ln 1", "add li $li $start_i", "get $file_content $li line", "add i $i 1", "jne $line $nil line_with_content", "lib \\'term.clear_line\\'", "prt \\'\\'", "let reached_end 1", "jmp content_loop", "#line_with_content", "len $line line_len", "jlt $line_len $line_max_1 line_len_ok", "sub max_ln $max_ln 1", "/ === wrap line", "let cc 0", "let wrap_ln 0", "#line_loop", "jeq $cc $line_max line_done", "mul c_idx $line_max $wrap_ln", "add c_idx $c_idx $cc", "jeq $c_idx $line_len whole_line_done", "get $line $c_idx line_c", "prt $line_c \\'\\'", "add cc $cc 1", "jmp line_loop", "#line_done", "prt \\'\\'", "add displayed_ln $displayed_ln 1", "jeq $displayed_ln $h content_done", "lib \\'term.color_print\\' \\'    \\' $nil 239", "add wrap_ln $wrap_ln 1", "let cc 0", "jmp line_loop", "#whole_line_done", "prt \\'\\'", "add displayed_ln $displayed_ln 1", "add wrap_ln $wrap_ln 1", "/ ^^^ wrap done", "jmp content_loop", "", "#line_len_ok", "prt $line", "add displayed_ln $displayed_ln 1", "jmp content_loop", "", "#content_done", "", "/ Bottom bar", "", "let bar_left $file_name", "add bar_left $bar_left \\'  \\'", "add bar_left $bar_left \\'q:quit  \u2193/\u2191:line  f/b:page \\'", "mul lli $li 100", "len $file_content total_len", "div progress $lli $total_len", "jlt $progress 101 valid_progress", "let progress 100", "#valid_progress", "add bar_right \\'\\' $progress", "add bar_right $bar_right \\'%\\'", "", "lib \\'term.color_print\\' $bar_left 0 255", "", "len $bar_left left_len", "len $bar_right right_len", "sub free_len $w $left_len", "sub free_len $free_len $right_len", "mul bar_space \\' \\' $free_len", "lib \\'term.color_print\\' $bar_space 0 255", "lib \\'term.color_print\\' $bar_right 0 255", "", "#key_listener", "let key_pressed 0", "lib \\'term.read_key\\' key", "jne $key 81 not_q", "/ QUIT: q", "cal clear", "jmp done", "#not_q", "", "jne $key 40 not_down", "/ DOWN", "jeq $reached_end 1 not_down", "add top_ln $top_ln 1", "let key_pressed 1", "jmp continue", "#not_down", "", "jne $key 38 not_up", "/ UP", "jeq $top_ln 1 not_up", "let reached_end 0", "sub top_ln $top_ln 1", "let key_pressed 1", "jmp continue", "#not_up", "", "jne $key 70 not_forward", "/ FORWARD: f", "jeq $reached_end 1 not_forward", "add top_ln $top_ln $h", "sub top_ln $top_ln $wrap_ln", "let key_pressed 1", "jmp continue", "#not_forward", "", "jne $key 66 not_backward", "/ BACKWARD: b", "sub top_ln $top_ln $h", "jgt $top_ln 0 valid_backward", "let top_ln 1", "#valid_backward", "let reached_end 0", "let key_pressed 1", "jmp continue", "#not_backward", "", "#continue", "", "slp 50", "", "jeq $key_pressed 0 key_listener", "cal clear", "jmp loop", "", "#print_usage", "prt \\'USAGE v file\\'", "jmp exit", "", "#err_term_not_supported", "prt \\'ERR Your current terminal is not supported\\'", "jmp exit", "", "#print_error_invalid_file", "prt \\'ERR No such file\\'", "jmp exit", "", "#print_error_directory", "prt \\'ERR \\\\"\\' \\'\\'", "prt $file_name \\'\\'", "prt \\'\\\\" is a directory\\'", "jmp exit", "", "#unsupported_file_type", "prt \\'ERR Unsupported file type\\'", "jmp exit", "", "#done", "lib \\'term.primary_buffer\\'", "", "#exit", "lib \\'term.set_prt_delay\\' 1"], "vi": [["lnk", "v"]], "whoami": [["exe", "show the current username"], "lib \\'util.get_path_by_str\\' \\'/env\\' path", "lib \\'util.verify_path\\' $path 0 is_valid_path", "jeq $is_valid_path 1 valid_path", "prt \\'ERR Invalid env path\\'", "jmp done", "#valid_path", "lib \\'os.read_file\\' $path \\'user\\' username", "prt $username", "#done"]}}'
 for _d $_fs
  get $_fs $_d _content
  put $root $_d $_content
 nxt
end
cal load_extra_files
let os_build '230529.2035'
let os_flavor 'pro'

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
 / Due to eval, use % for recog str
 let _s '%'

 #parse_string_char
 pol $_line _c
 ife $_c '\\\\'
  / escape
  pol $_line _cc
  ife $_cc '\\''
   psh $_s '\\''
   jmp parse_string_char
  fin
  ife $_cc '\\\\'
   psh $_s '\\\\'
   jmp parse_string_char
  fin
  ife $_cc 'n'
   psh $_s '\\n'
   jmp parse_string_char
  fin
  jmp parse_string_char
 fin
 ife $_c $_q
  / psh $_s $_q  / # the final quote
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

def parse_src
 let _src $0
 let _p $1         / ln-tokens: map
 let _lbl $2       / label-ln: map
 let _func_lbl $3  / func-label-ln: map of map
 let _funcs $4     / func-ln: map
 let _lc 0
 let _cur_func_name 'global'
 let _cur_func_lbl {}
 for _line $_src
  / check label
  #pull_first_char
  pol $_line _c1
  jeq $_c1 ' ' pull_first_char
  ife $_c1 '#'
   ife $_cur_func_name 'global'
    put $_lbl $_line $_lc
   els
    put $_cur_func_lbl $_line $_lc
   fin
  fin
  add _line $_c1 $_line
  cal parse_line $_line
  let _line_tokens $ret
  get $_line_tokens 0 _first_token
  ife $_first_token 'def'
   get $_line_tokens 1 _func_name 
   let _cur_func_name $_func_name
   put $_funcs $_func_name $_lc
  fin
  ife $_first_token 'end'
   / for jump to func end
   add _func_end $_cur_func_name '$$'
   put $_funcs $_func_end $_lc
   put $_func_lbl $_cur_func_name $_cur_func_lbl
   let _cur_func_lbl {}
   let _cur_func_name 'global'
  fin
  put $_p $_lc $_line_tokens
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
 ife $_c ''
  psh $_tokens $_s
  jmp next_token
 fin
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
/ *******************************
/ * A Runtime Script Interpreter
/ *******************************

let env {}       / global vars of current program
let env_stack [] / func-scoped vars of current programs
let frames []    / frame stack for all running programs
let loops {}
let prt_delay 5
let prt_delay_disabled 0
let sig_interrupt 0

let runtime_running 0
let key_press []

/ ====== evaluating ======
def expr
 let _expr $0
 let _original $0
 int _i $_expr
 jeq $_i $nil continue
 ret $_i
 #continue
 ife $_expr '[]'
  / 1. empty list
  ret []
 fin
 ife $_expr '{}'
  / 2. empty map
  ret {}
 fin
 pol $_expr _c1
 ife $_c1 '$'
  / 3. variable reference
  ife $_expr 'lastkey'
   pol $key_press _key
   ret $_key
  els
   ife $_expr 'nil'
    ret $nil
   els
    cal get_var_from_env $_expr
    ret $ret
   fin
  fin
 fin
 / str is parsed as %str, due to conflict with single quote
 ife $_c1 '%'
  / 4. string
  ret $_expr
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

def push_frame
 let _frame []
 psh $_frame $env
 psh $_frame $env_stack
 psh $frames $_frame
end

def pop_frame
 pop $frames _frame
 get $_frame 0 env
 get $_frame 1 env_stack
end

def add_var_to_env
 let _name $0
 let _val $1
 get $_name 0 _c
 ife $_c '_'
  pop $env_stack _top_env
  ife $_top_env $nil
   / add to global
   put $env $_name $_val
   ret
  fin
  put $_top_env $_name $_val
  psh $env_stack $_top_env
 els
  put $env $_name $_val
 fin
end

def get_var_from_env
 let _name $0
 int _vi $_name
 jeq $_vi $nil try_local_var
 jmp local_var
 #try_local_var
 get $_name 0 _c
 jne $_c '_' global_var
  #local_var
  pop $env_stack _top_env
  ife $_top_env $nil
   / get from global
   get $env $_name _val
   ret $_val
  fin
  get $_top_env $_name _val
  psh $env_stack $_top_env
  / ife $_val $nil
  /  get $env $_name _val
  /  ret $_val
  / fin
  ret $_val
 #global_var
  get $env $_name _val
  ret $_val
end

def look_up_lbl
 let _global_lbls $0
 let _func_lbls $1
 let _func_stack $2
 let _name $3
 pop $_func_stack _func_name
 ife $_func_name $nil
  / global
  get $_global_lbls $_name _pc
  ret $_pc
 els
  get $_func_lbls $_func_name _lbls
  get $_lbls $_name _pc
  psh $_func_stack $_func_name
  ret $_pc
 fin
end

def goto_if_end
 let _p $0
 let _pc $1
 let _stack 0
 #loop
 get $_p $_pc _line
 jeq $_line $nil done
 get $_line 0 _cmd
 jeq $_cmd 'ife' add_stack
 jeq $_cmd 'ifg' add_stack
 jmp continue
 #add_stack
 add _stack $_stack 1
 #continue
 ife $_cmd 'fin'
  jeq $_stack 0 done
  sub _stack $_stack 1
 fin
 add _pc $_pc 1
 jmp loop
 #done
 ret $_pc
end

def goto_if_false
 let _p $0
 let _pc $1
 add _pc $_pc 1  / first 'ife/ifg'
 let _stack 0
 #loop
 get $_p $_pc _line
 jeq $_line $nil done
 get $_line 0 _cmd
 jeq $_cmd 'ife' add_stack
 jeq $_cmd 'ifg' add_stack
 jmp continue
 #add_stack
 add _stack $_stack 1
 #continue
 ife $_cmd 'fin'
  jeq $_stack 0 done
  sub _stack $_stack 1
 fin
 ife $_cmd 'els'
  jeq $_stack 0 done
 fin
 add _pc $_pc 1
 jmp loop
 #done
 ret $_pc
end

def goto_loop_end
 let _p $0
 let _pc $1
 let _stack 0
 add _pc $_pc 1
 #loop
 get $_p $_pc _line
 jeq $_line $nil done
 get $_line 0 _cmd
 jeq $_cmd $nil next
 jeq $_cmd 'for' add_stack
 jmp continue
 #add_stack
 add _stack $_stack 1
 #continue
 ife $_cmd 'nxt'
  jeq $_stack 0 done
  sub _stack $_stack 1
 fin
 #next
 add _pc $_pc 1
 jmp loop
 #done
 ret $_pc
end

def back_to_loop_head
 let _p $0
 let _pc $1
 let _stack 0
 sub _pc $_pc 1
 #loop
 jlt $_pc 0 done
 get $_p $_pc _line
 get $_line 0 _cmd
 jeq $_cmd $nil next
 jeq $_cmd 'for' sub_stack
 jmp continue
 #sub_stack
 ife $_stack 0
  sub _pc $_pc 1
  jmp done
 fin
 sub _stack $_stack 1
 #continue
 ife $_cmd 'nxt'
  add _stack $_stack 1
 fin
 #next
 sub _pc $_pc 1
 jmp loop
 #done
 ret $_pc
end

/ ** main eval **
def runtime
 let _src $0
 let _args $1
 / == env frame ==
 let env {}               / global vars
 let env_stack []         / func env
/ == end of frame ==
 let _pc_stack []         / func call pc stack
 let _func_name_stack []  / func name stack
 let _p {}
 let _lbl {}       / global labels
 let _func_lbl {}  / function local labels
 let _funcs {}     / function name -> line map
 let _pc 0         / program counter
 let runtime_running 1
 let key_press []
 / read args
 let _i 0
 ife $_args $nil
 els
  for _arg $_args
   str _idx $_i
   put $env $_idx $_arg
   add _i $_i 1
  nxt
 fin

 cal parse_src $_src $_p $_lbl $_func_lbl $_funcs

 let sig_interrupt 0
 
 #eval_loop
 jeq $sig_interrupt 1 eval_done
 get $_p $_pc _line
 jeq $_line $nil eval_done
 get $_line 0 _cmd
 
 ife $_cmd 'clr'
  cal eval_param $_line 1
  ife $ret $nil
   clr
  els
   clr $ret
  fin
 fin
 ife $_cmd 'prt'
  get $_line 1 _val
  cal expr $_val
  let _val $ret
  get $_line 2 _val2
  ife $prt_delay_disabled 0
   slp $prt_delay
  fin
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
  cal add_var_to_env $_var $ret
 fin
 jeq $_cmd 'add' do_arithmetic
 jeq $_cmd 'sub' do_arithmetic
 jeq $_cmd 'mul' do_arithmetic
 jeq $_cmd 'div' do_arithmetic
 jeq $_cmd 'mod' do_arithmetic
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
  ife $_cmd 'mod'
   mod _res $_val1 $_val2
  fin
  cal add_var_to_env $_var $_res
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
 ife $_cmd 'pxl'
  get $_line 1 _name
  cal eval_param $_line 2
  let _x $ret
  cal eval_param $_line 3
  let _y $ret
  pxl $_x $_y _val
  cal add_var_to_env $_name $_val
 fin
 ife $_cmd 'jmp'
  get $_line 1 _lbl_name
  cal look_up_lbl $_lbl $_func_lbl $_func_name_stack $_lbl_name
  let _pc $ret
 fin

 jeq $_cmd 'jeq' do_cond_jump
 jeq $_cmd 'jne' do_cond_jump
 jeq $_cmd 'jgt' do_cond_jump
 jeq $_cmd 'jlt' do_cond_jump
 jmp non_cond_jump
 #do_cond_jump
  cal eval_param $_line 1
  let _v1 $ret
  cal eval_param $_line 2
  let _v2 $ret
  get $_line 3 _lbl_name
  ife $_cmd 'jeq'
    jne $_v1 $_v2 jeq_false
    cal look_up_lbl $_lbl $_func_lbl $_func_name_stack $_lbl_name
    let _pc $ret
    #jeq_false
  fin
  ife $_cmd 'jne'
    jeq $_v1 $_v2 jne_false
    cal look_up_lbl $_lbl $_func_lbl $_func_name_stack $_lbl_name
    let _pc $ret
    #jne_false
  fin
  ife $_cmd 'jgt'
    jgt $_v1 $_v2 jgt_true
    jmp jgt_false
    #jgt_true
    cal look_up_lbl $_lbl $_func_lbl $_func_name_stack $_lbl_name
    let _pc $ret
    #jgt_false
  fin
  ife $_cmd 'jlt'
    jlt $_v1 $_v2 jlt_true
    jmp jlt_false
    #jlt_true
    cal look_up_lbl $_lbl $_func_lbl $_func_name_stack $_lbl_name
    let _pc $ret
    #jlt_false
  fin
 #non_cond_jump

 ife $_cmd 'inp'
  get $_line 1 _var
  get $_line 2 _mask
  jeq $_mask $nil skip_mask_char
  cal eval_param $_line 2
  con 'mask' $ret
  #skip_mask_char
  inp _val
  con 'mask' $nil
  cal add_var_to_env $_var $_val
 fin
 ife $_cmd 'rnd'
  get $_line 1 _name
  cal eval_param $_line 2
  let _v1 $ret
  cal eval_param $_line 3
  let _v2 $ret
  rnd _r $_v1 $_v2
  cal add_var_to_env $_name $_r
 fin
 ife $_cmd 'prs'
  get $_line 1 _name
  cal eval_param $_line 2
  let _v $ret
  prs _tmp $_v
  cal add_var_to_env $_name $_tmp
 fin
 jeq $_cmd 'int' type_cmd
 jeq $_cmd 'str' type_cmd
 jeq $_cmd 'typ' type_cmd
 jmp not_type_cmd
 #type_cmd
 get $_line 1 _var
 cal eval_param $_line 2
 ife $_cmd 'int'
  int _val $ret
 fin
 ife $_cmd 'str'
  str _val $ret
 fin
 ife $_cmd 'typ'
  typ _val $ret
 fin
 cal add_var_to_env $_var $_val
 #not_type_cmd
 ife $_cmd 'tim'
  get $_line 1 _var
  get $_line 2 _time
  tim _val $_time
  cal add_var_to_env $_var $_val
 fin
 ife $_cmd 'len'
  cal eval_param $_line 1
  let _list $ret
  get $_line 2 _name
  len $_list _len
  cal add_var_to_env $_name $_len
 fin
 ife $_cmd 'pol'
  cal eval_param $_line 1
  let _list $ret
  get $_line 2 _name
  pol $_list _first
  get $_line 1 _list_name
  pol $_list_name x
  cal add_var_to_env $_list_name $_list
  cal add_var_to_env $_name $_first
 fin
 ife $_cmd 'pop'
  cal eval_param $_line 1
  let _list $ret
  get $_line 2 _name
  pop $_list _last
  get $_line 1 _list_name
  pol $_list_name x
  cal add_var_to_env $_list_name $_list
  cal add_var_to_env $_name $_last
 fin
 ife $_cmd 'psh'
  cal eval_param $_line 1
  let _list $ret
  len $_line _line_len
  sub _line_len $_line_len 2
  for i $_line_len
    add j $i 2
    cal eval_param $_line $j
    let _val $ret
    psh $_list $_val
  nxt
  get $_line 1 _list_name
  pol $_list_name x
  cal add_var_to_env $_list_name $_list
 fin
 ife $_cmd 'put'
  cal eval_param $_line 1
  let _map $ret
  cal eval_param $_line 2
  let _key $ret
  cal eval_param $_line 3
  let _val $ret
  put $_map $_key $_val
  typ _type $_map
  ife $_type 'str'
   / replace string value
   get $_line 1 _var_name
   pol $_var_name _
   cal add_var_to_env $_var_name $_map
  fin
 fin
 ife $_cmd 'get'
  cal eval_param $_line 1
  let _list $ret
  cal eval_param $_line 2
  let _key $ret
  get $_list $_key _val
  get $_line 3 _var
  cal add_var_to_env $_var $_val
 fin
 ife $_cmd 'key'
  cal eval_param $_line 1
  let _map $ret
  cal eval_param $_line 2
  let _var $ret
  key $_map _keys
  cal add_var_to_env $_var $_keys
 fin
 ife $_cmd 'del'
  cal eval_param $_line 1
  let _map $ret
  cal eval_param $_line 2
  let _key $ret
  del $_map $_key
 fin
 ife $_cmd 'ife'
  cal eval_param $_line 1
  let _v1 $ret
  cal eval_param $_line 2
  let _v2 $ret
  jeq $_v1 $_v2 continue_if_true
   cal goto_if_false $_p $_pc
   let _pc $ret
  #continue_if_true
 fin
 ife $_cmd 'ifg'
  cal eval_param $_line 1
  let _v1 $ret
  cal eval_param $_line 2
  let _v2 $ret
  jgt $_v1 $_v2 continue_if_true
   cal goto_if_false $_p $_pc
   let _pc $ret
  #continue_if_true
 fin
 ife $_cmd 'els'
  cal goto_if_end $_p $_pc
  let _pc $ret
 fin
 ife $_cmd 'fin'
 fin

 / ** for loop **
 ife $_cmd 'for'
  get $_line 1 _var
  cal eval_param $_line 2
  let _rg $ret
  get $loops $_var _state
  ife $_state $nil
   / init new loop
   let _rg_list []
   for _e $_rg
    psh $_rg_list $_e
   nxt
   let _obj {}
   put $_obj 'items' $_rg_list
   put $_obj 'pc' $_pc
   put $_obj 'index' 0
   put $loops $_var $_obj 
  fin

  get $loops $_var _state
  get $_state 'items' _items
  get $_state 'index' _index
  len $_items _len
  jeq $_index $_len loop_finished
  jgt $_index $_len loop_finished
  get $_items $_index _cur
  cal add_var_to_env $_var $_cur
  add _index $_index 1
  put $_state 'index' $_index
  jmp for_end
  #loop_finished
   del $loops $_var
   cal goto_loop_end $_p $_pc
   let _pc $ret
  #for_end
 fin
 ife $_cmd 'nxt'
  cal back_to_loop_head $_p $_pc
  let _pc $ret
 fin

 / ** function commands **
 ife $_cmd 'end'
  pop $env_stack _
  pop $_pc_stack _pc
  pop $_func_name_stack _
 fin
 ife $_cmd 'ret'
   get $_line 1 _res
   ife $_res $nil
    let _res_val $nil
   els
    cal eval_param $_line 1
    let _res_val $ret
   fin
   pop $env_stack _
   cal add_var_to_env 'ret' $_res_val
   pop $_pc_stack _pc
   pop $_func_name_stack _
 fin
 ife $_cmd 'def'
  / jump to func end
  get $_line 1 _func_name
  add _func_end $_func_name '$$'
  get $_funcs $_func_end _pc
 fin
 ife $_cmd 'cal'
  psh $_pc_stack $_pc
  get $_line 1 _func_name
  psh $_func_name_stack $_func_name
  get $_funcs $_func_name _pc
  let _new_frame {}
  let _i 2
  #read_args_loop
  get $_line $_i _argv
  jeq $_argv $nil read_args_finished
  sub _j $_i 2
  cal eval_param $_line $_i
  str _argi $_j
  put $_new_frame $_argi $ret
  add _i $_i 1
  jmp read_args_loop
  #read_args_finished
  psh $env_stack $_new_frame
 fin

 / ** system library **
 ife $_cmd 'lib'
  cal eval_param $_line 1
  let _lib_name $ret
  ife $_lib_name 'os.get_home_path'
   cal get_home_path
   get $_line 2 _name
   cal add_var_to_env $_name $ret
  fin
  ife $_lib_name 'os.get_current_path'
   cal lib_get_path
   get $_line 2 _name
   cal add_var_to_env $_name $ret
  fin
  ife $_lib_name 'os.set_current_path'
   cal eval_param $_line 2
   cal lib_set_path $ret
  fin
  ife $_lib_name 'os.delete_path'
   cal eval_param $_line 2
   cal lib_delete_path $ret
  fin
  ife $_lib_name 'os.make_dir'
   cal eval_param $_line 2
   let _path $ret
   cal eval_param $_line 3
   let _name $ret
   cal lib_make_dir $_path $_name
  fin
  ife $_lib_name 'os.get_file_list'
   cal eval_param $_line 2
   let _path $ret
   cal lib_get_file_list $_path
   get $_line 3 _name
   cal add_var_to_env $_name $ret
  fin
  ife $_lib_name 'os.get_file_type'
   cal eval_param $_line 2
   let _path $ret
   cal eval_param $_line 3
   let _file_name $ret
   cal lib_get_file_type $_path $_file_name
   get $_line 4 _file_type_name
   cal add_var_to_env $_file_type_name $ret
  fin
  ife $_lib_name 'os.read_file'
   cal eval_param $_line 2
   let _path $ret
   cal eval_param $_line 3
   let _file_name $ret
   cal lib_read_file $_path $_file_name
   get $_line 4 _file_content_name
   cal add_var_to_env $_file_content_name $ret
  fin
  ife $_lib_name 'os.write_file'
   cal eval_param $_line 2
   let _path $ret
   cal eval_param $_line 3
   let _file_name $ret
   cal eval_param $_line 4
   let _file_content $ret
   cal lib_write_file $_path $_file_name $_file_content
  fin
  ife $_lib_name 'os.get_os_info'
   get $_line 2 _info
   cal lib_get_os_info
   cal add_var_to_env $_info $ret
  fin
  ife $_lib_name 'os.get_sys_info'
   get $_line 2 _info
   cal lib_get_sys_info
   cal add_var_to_env $_info $ret
  fin
  ife $_lib_name 'os.execute'
   cal eval_param $_line 2
   let _file_path_and_args_str $ret
   / pack & push frame
   cal push_frame
   cal parse_input $_file_path_and_args_str
   cal run $ret
   / pop & unpack frame
   cal pop_frame
  fin
  ife $_lib_name 'os.get_env_var'
   cal eval_param $_line 2
   let _file_name $ret
   let _file_path []
   psh $_file_path 'env'
   get $_line 3 _name
   cal lib_read_file $_file_path $_file_name
   cal add_var_to_env $_name $ret
  fin
  ife $_lib_name 'os.set_env_var'
   cal eval_param $_line 2
   let _var_name $ret
   cal eval_param $_line 3
   let _var_val $ret
   let _file_path []
   psh $_file_path 'env'
   cal lib_write_file $_file_path $_var_name $_var_val
  fin
  ife $_lib_name 'util.get_path_by_str'
   cal eval_param $_line 2
   let _path_str $ret
   cal get_path_by_str $_path_str $_relative_to
   get $_line 3 _name
   cal add_var_to_env $_name $ret
  fin
  ife $_lib_name 'util.verify_path'
   cal eval_param $_line 2
   let _path $ret
   cal eval_param $_line 3
   let _is_file $ret
   cal verify_path $_path $_is_file
   get $_line 4 _name
   cal add_var_to_env $_name $ret
  fin
  ife $_lib_name 'util.get_real_path'
   cal eval_param $_line 2
   cal get_real_path $ret
   get $_line 3 _name
   cal add_var_to_env $_name $ret
  fin
  ife $_lib_name 'dev.set_led'
   cal eval_param $_line 2
   let _idx $ret
   cal eval_param $_line 3
   let _val $ret
   cal lib_set_led $_idx $_val
  fin
  ife $_lib_name 'term.prev_line'
   cal lib_screen_up_arrow
  fin
  ife $_lib_name 'term.clear_line'
   cal lib_screen_clear_line
  fin
  ife $_lib_name 'term.clear_screen'
   cal lib_screen_clear_screen
  fin
  ife $_lib_name 'term.alternate_buffer'
   cal lib_screen_alternate_buffer
  fin
  ife $_lib_name 'term.primary_buffer'
   cal lib_screen_primary_buffer
  fin
  ife $_lib_name 'term.color_print'
   cal eval_param $_line 2
   let _text $ret
   cal eval_param $_line 3
   let _fg_color $ret
   cal eval_param $_line 4
   let _bg_color $ret
   cal lib_screen_color_print $_text $_fg_color $_bg_color
  fin
  ife $_lib_name 'term.set_prt_delay'
   cal eval_param $_line 2
   cal lib_set_prt_delay $ret
  fin
  ife $_lib_name 'term.get_width'
   get $_line 2 _name
   cal add_var_to_env $_name $term_w
  fin
  ife $_lib_name 'term.get_height'
   get $_line 2 _name
   cal add_var_to_env $_name $term_h
  fin
  ife $_lib_name 'term.set_cursor_position'
   cal eval_param $_line 2
   let _x $ret
   cal eval_param $_line 3
   let _y $ret
   cal lib_screen_set_cursor_position $_x $_y
  fin
  ife $_lib_name 'term.move_cursor'
   cal eval_param $_line 2
   let _dx $ret
   cal eval_param $_line 3
   let _dy $ret
   ifg $_dx 0
    for _ $_dx
     cal lib_screen_right_arrow
    nxt
   els
    mul _ndx $_dx -1
    for _ $_ndx
     cal lib_screen_left_arrow
    nxt
   fin
   ifg $_dy 0
    for _ $_dy
     cal lib_screen_down_arrow
    nxt
   els
    mul _ndy $_dy -1
    for _ $_ndy
     cal lib_screen_up_arrow
    nxt
   fin
  fin
  ife $_lib_name 'term.read_key'
   get $_line 2 _name
   pol $key_press _key
   cal add_var_to_env $_name $_key
  fin
  ife $_lib_name 'net.http'
   cal eval_param $_line 2
   let _req $ret
   get $_line 3 _var
   net $_req tmp
   cal add_var_to_env $_var $tmp
  fin

 fin

 add _pc $_pc 1
 jmp eval_loop
 
 #eval_done
 let sig_interrupt 0
 len $frames _num_frames
 ife $_num_frames 0
  / frame stack is empty
  let runtime_running 0
 fin
end
def get_prompt_str
 cal get_path_by_str '/env'
 let _path $ret
 cal verify_path $_path 0
 ife $ret 0
  prt 'ERR Invalid prompt path'
  ret '>'
 fin
 cal get_by_path $_path
 let _env_dir $ret
 get $_env_dir 'prompt' _prompt
 ife $_prompt $nil
  let _prompt_str '>'
 els
  let _prompt_str ''
  cal parse_input $_prompt
  for _tk $ret
   ife $_tk '$p'
    cal shorten_home_path $path
    cal path_to_str $ret
    add _prompt_str $_prompt_str $ret
    jmp parse_prompt_next
   fin
   add _prompt_str $_prompt_str $_tk
   #parse_prompt_next
  nxt
 fin
 ret $_prompt_str
end

def shorten_home_path
 / change home dir to ~
 let _path $0
 cal get_home_path
 let _home_path $ret
 len $_path _path_len
 len $_home_path _home_path_len
 ifg $_home_path_len $_path_len
  ret $_path
 fin
 let _i 0
 let _in_home 1
 #check_home_path_loop
 jeq $_i $_home_path_len check_home_path_done
 get $_home_path $_i _home_d
 get $_path $_i _path_d
 ife $_home_d $_path_d
  add _i $_i 1
  jmp check_home_path_loop
 els
  let _in_home 0
 fin
 #check_home_path_done
 ife $_in_home 0
  ret $_path
 fin
 let _in_home_path []
 psh $_in_home_path '~'
 sub _rest_path_len $_path_len $_i
 for _j $_rest_path_len
  add _k $_j $_i
  get $_path $_k _d
  psh $_in_home_path $_d
 nxt
 ret $_in_home_path
end

def get_home_path
 cal get_path_by_str $env_user
 let _env_user_path $ret
 cal verify_path $_env_user_path 1
 ife $ret 0
  prt 'ERR Invalid home path'
  ret '/'
 fin
 pop $_env_user_path _env_user_filename
 cal get_by_path $_env_user_path
 get $ret $_env_user_filename _user_name
 let _home_path []
 psh $_home_path 'home' $_user_name
 ret $_home_path
end

def get_env_path
 cal split_str $env_path '/'
 cal get_by_path $ret
 let _env_path_str $ret
 cal get_path_by_str $_env_path_str
 ret $ret
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

def get_by_path
 let _path $0
 let _curr_path $root
 for _d $_path
  typ _typ $_curr_path
  ife $_typ 'map'
   get $_curr_path $_d _curr_path
  els
   ret $nil
  fin
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

def path_to_str
 / convert path list to string (no validation)
 let _path $0
 let _str ''
 for _p $_path
  ife $_p '~'
   add _str $_str $_p
  els
   add _str $_str '/'
   add _str $_str $_p
  fin
 nxt
 ife $_str ''
  ret '/'
 fin
 ret $_str
end

def get_path_by_str
 let _path_str $0      / assert non-empty
 let _relative_to $1   / default relative to current path
 get $_path_str 0 _path_first_c
 
 let _full_path []
 ife $_path_first_c '/'
  / absolute path
  let _full_path []
 els
  ife $_path_first_c '~'
   / home path
   cal get_home_path
   let _full_path $ret
   pol $_path_str x
  els
   / relative path
   ife $_relative_to $nil
    let _relative_to $path
   fin
   for _p $_relative_to
    psh $_full_path $_p
   nxt
  fin
 fin
 
 / split path string to list
 cal split_str $_path_str '/'
 let _path $ret

 for _p $_path
  psh $_full_path $_p
 nxt

 let _dup_full_path []
 let _real_full_path []
 for _p $_full_path
  ife $_p '..'
   pop $_dup_full_path a
   pop $_real_full_path a
  els
   jeq $_p '.' skip_cur_dir
   psh $_dup_full_path $_p
   psh $_real_full_path $_p
   #skip_cur_dir
  fin
 nxt
 ret $_real_full_path
end

def verify_path / -> 1: true, 0: false
 let _path $0
 let _if_file $1
 let _curr_path $root
 let _i 0
 #verify_path_next
 get $_path $_i _p
 ife $_p $nil
  len $_path _path_len
  jeq $_i $_path_len verify_path_true
  ret 0
 fin
 typ _path_typ $_curr_path
 ife $_path_typ 'map'
  get $_curr_path $_p _curr_path
  ife $_curr_path $nil
   ret 0
  fin
 els
  ret 0
 fin
 add _i $_i 1
 jmp verify_path_next
 #verify_path_true
 ife $_if_file 1
  ret 1
 els
  typ _path_typ $_curr_path
  ife $_path_typ 'map'   / check final dir is valid
   ret 1
  els
   / check if is a link path
   ife $_path_typ 'list'
    get $_curr_path 0 _meta_data
    typ _meta_data_type $_meta_data
    ife $_meta_data_type 'list'
     ret 1
    fin
    ret 0
   els
    ret 0
   fin
  fin
 fin
end

/ process links
def get_real_path
 let _path $0
 let _real_path []
 let _invalid 0
 for _pp $_path
  cal lib_get_file_type $_real_path $_pp
  let _file_type $ret
  ife $_file_type 'dir'
   psh $_real_path $_pp
  els
   ife $_file_type 'lnk'
    cal lib_read_file $_real_path $_pp
    get $ret 0 _file_meta
    get $_file_meta 1 _link_path_str
    cal get_path_by_str $_link_path_str $_real_path
    let _real_path $ret
   els
    / Invalid path
    let _invalid 1
   fin
  fin
 nxt
 ife $_invalid 1
  ret $nil
 fin
 ret $_real_path
end

def check_executable
 let _file $0
 typ file_type $_file
 ife $file_type 'list'
  cal get_list_type $_file
  jeq $ret 'exe' is_executable
  jeq $ret 'bat' is_executable
  ret 0
  #is_executable
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

def get_list_type
 let _fc $0
 get $_fc 0 _meta
 typ _line_1_typ $_meta
 ife $_line_1_typ 'list'
  get $_meta 0 _t
  ret $_t
 els
  ret 'lst'
 fin
end

def str_startwith
 let s1 $0
 let s2 $1
 #loop
 ife $s2 ''
  ret 1
 fin
 pol $s1 c1
 pol $s2 c2
 jeq $c1 $c2 loop
 ret 0
end

def filter_list_by_startwith
 let _list $0
 let _start $1
 let _res []
 for _s $_list
  cal str_startwith $_s $_start
  ife $ret 1
   psh $_res $_s
  fin
 nxt
 ret $_res
end
/ ==== MAIN ====
def main
 cal get_home_path
 let path $ret

 jeq $0 $nil repl_loop
 / continue with init program
 let _in $0
 jmp parse_and_execute

 #repl_loop
  cal get_prompt_str
  prt $ret ''
  inp _in
  #parse_and_execute
  cal execute_cmd $_in
  jeq $ret 0 exit_on_0
 jmp repl_loop
 #exit_on_0
 prt '>> Session ended <<'
end

/ ==== RUN ====
def run
 let _tokens $0
 pol $_tokens _d
 ife $_d $nil
  cal print_error 'Invalid file name'
  ret
 fin

 cal get_path_by_str $_d
 let _prog_path $ret
 pop $_prog_path _prog
 cal get_real_path $_prog_path
 let _real_path $ret
 cal get_by_path $_real_path
 let prog_dir $ret

 get $prog_dir $_prog _file_content
 cal lib_get_file_type $_real_path $_prog

 ife $ret 'lnk'
  get $_file_content 0 _file_meta
  get $_file_meta 1 _link_path_str
  cal get_path_by_str $_link_path_str $_real_path
  let _prog_path $ret
  pop $_prog_path _prog
  
  cal get_by_path $_prog_path
  let prog_dir $ret
  get $prog_dir $_prog _file_content
 fin

 ife $_file_content $nil
  cal print_error 'File not found'
 els
  cal check_executable $_file_content
  ife $ret 1
   get $_file_content 0 _meta_data
   get $_meta_data 0 _file_type
   let _exe []
   len $_file_content _length
   sub _length $_length 1   / skip frist meta line
   for _i $_length
    add _j $_i 1
    get $_file_content $_j _line
    psh $_exe $_line
   nxt
   ife $_file_type 'exe'
    / exe
    cal runtime $_exe $_tokens
   els
    / bat shell script
    cal shell $_exe $_tokens
   fin
  els
   cal print_error 'File not executable'
  fin
 fin
end

/ ==== SHELL BATCH ====
def shell
 let _lines $0
 let _args $1  / top level args, not used
 let _i 0
 len $_lines _len
 #loop
  jeq $_i $_len done
  get $_lines $_i _line
  cal execute_cmd $_line
  add _i $_i 1
 jmp loop
 #done
end

/ ==== EXECUTE COMMAND ====
def execute_cmd
 cal parse_input $0
 let tokens $ret
 #exec_tokens
 pol $tokens cmd

 jeq $cmd 'exit' exit
 jeq $cmd $nil continue

 / -- RUN EXE --
 len $cmd cmd_len
 let _is_executable 0
 for _c $cmd
  ife $_c '/'
   let _is_executable 1
  fin
 nxt
 ife $_is_executable 1
  let _tokens []
  psh $_tokens $cmd
  for _t $tokens
   psh $_tokens $_t
  nxt
  cal run $_tokens
  jmp continue
 fin

 / -- SAVE --
 ife $cmd 'save'
  sav 'moon.json' $root
  prt '[Saved]'
  jmp continue
 fin

 / -- LOAD --
 ife $cmd 'load'
  lod 'moon.json' loaded_data
  ife $loaded_data $nil
   cal print_error 'There is no saved data'
  els
   let root $loaded_data
   prt '[Loaded]'
  fin
  jmp continue
 fin

 / -- (EMPTY) --
 ife $cmd $nil
  jmp continue
 fin

 / -- (ENV PROGRAM) --
 cal split_str $env_path '/'
 cal get_by_path $ret
 let _env_path_str $ret
 cal get_path_by_str $_env_path_str
 ife $ret $nil
  jmp skip_env_program
 fin
 
 let _program_dir $root
 for _d $ret
  get $_program_dir $_d _program_dir
 nxt
 let _has_program 0
 for _p $_program_dir
  ife $_p $cmd
   let _has_program 1
  fin
 nxt
 ife $_has_program 1
  let _new_tokens []
  add _prog_path $_env_path_str '/'
  add _prog_path $_prog_path $cmd
  psh $_new_tokens $_prog_path
  for t $tokens
   psh $_new_tokens $t
  nxt
  let tokens $_new_tokens
  jmp exec_tokens
 fin
 #skip_env_program

 / -- (INVALID) --
 add err_msg 'Unknown command: ' $cmd
 cal print_error $err_msg
 jmp continue

 #continue
 ret 1

 #exit
 ret 0
end

cal main $init_cmd
def lib_get_home_path
 cal get_home_path
 ret $ret
end

def lib_get_path
 let _path_str $0
 let _is_file $1
 ife $_path_str $nil
  let _path []
  for _p $path
   psh $_path $_p
  nxt
  ret $_path
 fin
 cal get_path_by_str $_path_str
 ret $ret
end

def lib_set_path
 let _path $0
 cal get_real_path $_path
 cal verify_path $ret 0
 let _is_valid $ret
 ife $_is_valid 1
  let path []
  for _px $_path
   psh $path $_px
  nxt
 fin
end

def lib_delete_path
 let _path $0
 len $_path _len
 ifg $_len 0
  sub _path_len $_len 1
  let _current_path $root
  sub _last_idx $_len 1
  get $_path $_last_idx _last
  for _i $_path_len
   get $_path $_i _d
   get $_current_path $_d _current_path
  nxt
  del $_current_path $_last
 fin
end

def lib_make_dir
 let _path $0
 let _name $1
 cal get_by_path $_path
 let _dir $ret
 get $_dir $_name _exist
 ife $_exist $nil
  put $_dir $_name {}
 fin
end

def lib_get_file_list
 let _path $0
 cal get_by_path $_path
 let _curr_dir $ret
 let _result []
 for _f $_curr_dir
  psh $_result $_f
 nxt
 ret $_result
end

def lib_get_file_type
 let _path $0
 let _file_name $1
 cal get_by_path $_path
 let _dir $ret
 get $_dir $_file_name _fc
 typ _ft $_fc
 ife $_ft 'str'
  ret 'raw'
 fin
 ife $_ft 'map'
  ret 'dir'
 fin
 ife $_ft 'list'
  cal get_list_type $_fc
  ret $ret
 fin
 ret 'xxx'
end

def lib_read_file
 let _path $0
 let _file_name $1
 cal get_by_path $_path
 get $ret $_file_name _file_content
 ret $_file_content
end

def lib_write_file
 let _path $0
 let _file_name $1
 let _file_content $2
 cal get_by_path $_path
 put $ret $_file_name $_file_content
end

def lib_set_led
 let _idx $0
 let _val $1
 led $_idx $_val
end

def lib_get_os_info
 let _info []
 psh $_info $os_name
 let _full_ver $os_ver
 add _full_ver $_full_ver '_'
 add _full_ver $_full_ver $os_flavor
 psh $_info $_full_ver
 psh $_info $os_build
 psh $_info $os_host
 ret $_info
end

def lib_get_sys_info
 let _info {}
 tim _current now
 sub _uptime $_current $boot_time
 put $_info 'uptime' $_uptime
 ret $_info
end

def lib_screen_clear_line
 con 'clear' 'line'
end

def lib_screen_clear_screen
 con 'clear' 'screen'
end

def lib_screen_color_print
 let _text $0
 let _fg_color $1
 let _bg_color $2
 con 'color_print' $_text $_fg_color $_bg_color
end

def lib_screen_up_arrow
 con 'cursor' 'up'
end

def lib_screen_down_arrow
 con 'cursor' 'down'
end

def lib_screen_left_arrow
 con 'cursor' 'left'
end

def lib_screen_right_arrow
 con 'cursor' 'right'
end

def lib_screen_set_cursor_position
 let _line $0
 let _column $1
 con 'cursor' 'position' $_line $_column
end

def lib_screen_alternate_buffer
 con 'buffer' 'alternate'
end

def lib_screen_primary_buffer
 con 'buffer' 'primary'
end

def lib_set_prt_delay
 ife $0 0
  let prt_delay_disabled 1
 els
  let prt_delay_disabled 0
 fin
end
`
