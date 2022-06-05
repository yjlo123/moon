/* Built on Sun  5 Jun 2022 00:49:17 EDT */
let moonSrc = `
let os_name 'Moon OS'
let os_ver '1.18'
let os_build 'N/A'

let init_cmd '/programs/motd'

let root {}
let path []
let env_path ''
let env_prompt ''
let env_user ''

tim boot_time now
let leds []

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

 / /dev
 let _dev_dir {}
 put $_dev_dir 'led' '0'
 put $root 'dev' $_dev_dir

 / init leds
 put $leds 0 0
 put $leds 1 0
 put $leds 2 0

end

cal init_files
def load_extra_files
 prs _fs '{"home": {"guest": {"note": [["txt"], "------------- Moon OS Manual ------------", "programs -- list all available programs", "ls [<d>]-- list directory contents", "pwd -- show path of current directory", "cd <d> -- change directory", "cat <f> -- concatenate and print a file", "v <f> -- view file contents", "./<exe_file> -- run an executable file", "echo <s> -- output an argument", "..[> <f>] -- write to a file", "..[>> <f>] -- append to a file", "Others: mv, cp, rm, head, tail, date ...", "-----------------------------------------"], "misc": {"test": "Hello World!"}, "challenge": [["txt"], "=== CHALLENGE ===", "Turn on the 3 LEDs on the bottom right of the monitor", "Do not hack the front-end webpage", "Use only the supported commands in Moon OS", "~Siwei"], "led": [["exe"], "let val $0", "jeq $val $nil error", "jeq $val 1 turn_on", "jeq $val 0 turn_off", "jmp error", "#turn_on", "led 1", "prt \\'LED ON\\'", "jmp end", "#turn_off", "led 0", "prt \\'LED OFF\\'", "jmp end", "#error", "prt \\'1: ON; 0: OFF\\'", "#end"], "sample": {"hello": [["exe"], "prt \\'Hello!\\'", "slp 500", "prt \\'Bye~\\'"], "count": [["exe"], "let n 5", "#loop", "prt $n", "sub n $n 1", "slp 600", "jne $n 0 loop"], "compute_age": [["exe"], "prt \\'Input year born: \\' \\'\\'", "inp _year", "int _year $_year", "tim _current year", "sub age $_current $_year", "prt \\'Age: \\' \\'\\'", "prt $age"]}, "games": [["lnk", "/games"]]}}, "games": {"test": [["exe"], "prt \\'This is a test game\\'"], "sliding": [["exe", "A sliding puzzle game"], "/ https://runtime.siwei.dev/?src=puzzle", "/ by Siwei", "/ Feb 2019", "let num0 \\'001100010010010010010010001100\\'", "let num1 \\'001000001000001000001000001000\\'", "let num2 \\'011110000100001000010010001100\\'", "let num3 \\'001110010000001000010000001110\\'", "let num4 \\'010000010000011110010010010000\\'", "let num5 \\'001110010000001110000010011110\\'", "let num6 \\'001100010010001110000010001100\\'", "let num7 \\'001000001000001000010000011110\\'", "let num8 \\'001100010010001100010010001100\\'", "let num9 \\'001100010000011100010010001100\\'", "", "let empty \\'000000000000000000000000000000\\'", "", "let map {}", "put $map 1 $num1", "put $map 2 $num2", "put $map 3 $num3", "put $map 4 $num4", "put $map 5 $num5", "put $map 6 $num6", "put $map 7 $num7", "put $map 8 $num8", "put $map 9 $empty", "", "let cur 9", "", "/ -- print info --", "prt \\'SLIDING PUZZLE v1.0\\'", "prt \\'- Press arrow keys to slide\\'", "", "/ -- shuffle numbers--", "let move_count 0", "let prev_dir -1", "", "#shuffle", "rnd dir 0 4", "", "/ -- prevent slide back and forth", "sub opp $dir 2", "jeq $opp $prev_dir next_shuffle", "add opp $dir 2", "jeq $opp $prev_dir next_shuffle", "", "jne $dir 0 try_down", "/ try right", "jeq $cur 3 next_shuffle", "jeq $cur 6 next_shuffle", "jeq $cur 9 next_shuffle", "jmp swap_right", "#try_down", "jne $dir 1 try_left", "jeq $cur 7 next_shuffle", "jeq $cur 8 next_shuffle", "jeq $cur 9 next_shuffle", "jmp swap_down", "#try_left", "jne $dir 2 try_up", "jeq $cur 1 next_shuffle", "jeq $cur 4 next_shuffle", "jeq $cur 7 next_shuffle", "jmp swap_left", "#try_up", "jne $dir 3 next_shuffle", "jeq $cur 1 next_shuffle", "jeq $cur 2 next_shuffle", "jeq $cur 3 next_shuffle", "jmp swap_up", "", "#swap_right", "add target $cur 1", "jmp swap", "#swap_left", "sub target $cur 1", "jmp swap", "#swap_down", "add target $cur 3", "jmp swap", "#swap_up", "sub target $cur 3", "jmp swap", "", "#swap", "get $map $target ln", "put $map $cur $ln", "put $map $target $empty", "let cur $target", "add move_count $move_count 1", "let prev_dir $dir", "", "#next_shuffle", "jlt $move_count 20 shuffle", "", "jmp draw_number", "", "#begin", "", "/ -- check key --", "let key $lastkey", "jne $key 37 check_up", "jeq $cur 3 next", "jeq $cur 6 next", "jeq $cur 9 next", "jmp press_left", "#check_up", "jne $key 38 check_right", "jeq $cur 7 next", "jeq $cur 8 next", "jeq $cur 9 next", "jmp press_up", "#check_right", "jne $key 39 check_down", "jeq $cur 1 next", "jeq $cur 4 next", "jeq $cur 7 next", "jmp press_right", "#check_down", "jne $key 40 next", "jeq $cur 1 next", "jeq $cur 2 next", "jeq $cur 3 next", "jmp press_down", "", "jmp draw_number", "", "#press_left", "add target $cur 1", "jmp update_index", "#press_right", "sub target $cur 1", "jmp update_index", "#press_up", "add target $cur 3", "jmp update_index", "#press_down", "sub target $cur 3", "jmp update_index", "", "#update_index", "get $map $target ln", "put $map $cur $ln", "put $map $target $empty", "let cur $target", "", "/ -- draw numbers --", "#draw_number", "clr 20", "", "let x1 1", "let y1 2", "", "let idx_c 0", "let idx_r 0", "", "let idx 1", "#next_num", "get $map $idx num", "", "add x2 $x1 5", "add y2 $y1 6", "", "sub i $y1 1", "let j $x1", "", "#draw_num_row", "let j $x1", "add i $i 1", "#draw_num_col", "pop $num c", "drw $j $i $c", "jeq $j $x2 draw_num_row", "add j $j 1", "jne $i $y2 draw_num_col", "add x1 $x1 8", "add idx_c $idx_c 1", "add idx $idx 1", "jne $idx_c 3 next_num", "", "let x1 1", "add y1 $y1 7", "let idx_c 0", "add idx_r $idx_r 1", "jne $idx_r 3 next_num", "", "", "/ -- check win --", "get $map 1 pos_num", "jne $pos_num $num1 next", "get $map 2 pos_num", "jne $pos_num $num2 next", "get $map 3 pos_num", "jne $pos_num $num3 next", "get $map 4 pos_num", "jne $pos_num $num4 next", "get $map 5 pos_num", "jne $pos_num $num5 next", "get $map 6 pos_num", "jne $pos_num $num6 next", "get $map 7 pos_num", "jne $pos_num $num7 next", "get $map 8 pos_num", "jeq $pos_num $num8 win", "", "#next", "slp 10", "jmp begin", "", "#win", "prt \\'You Win!\\'"]}, "programs": {"cal": [["exe", "displays the calendar of the current month"], "let months []", "psh $months \\'Jan\\' \\'Feb\\' \\'Mar\\' \\'Apr\\'", "psh $months \\'May\\' \\'Jun\\' \\'Jul\\' \\'Aug\\'", "psh $months \\'Sep\\' \\'Oct\\' \\'Nov\\' \\'Dec\\'", "let month_days []", "psh $month_days 31 28 31 30 31 30 31 31 30 31 30 31", "tim _day day", "tim _month month", "tim _date date", "tim _year year", "get $months $_month _month_str", "prt \\'      \\' \\'\\'", "prt $_month_str \\' \\'", "prt $_year", "get $month_days $_month day_count", "jne $_month 1 check_leap_done", "mod res $_year 400", "jeq $res 0 leap_year", "mod res $_year 100", "jeq $res 0 check_leap_done", "mod res $_year 4", "jeq $res 0 leap_year", "jmp check_leap_done", "#leap_year", "let day_count 29", "#check_leap_done", "prt \\'Su Mo Tu We Th Fr Sa\\'", "let i 0", "let column 0", "let shift $_day", "mod back_off $_date 7", "sub shift $shift $back_off", "jlt $shift 0 add_seven", "jmp adjust_shift", "#add_seven", "add shift $shift 7", "#adjust_shift", "add shift $shift 1", "mod shift $shift 7", "#skip_cell", "jeq $i $shift start", "prt \\'   \\' \\'\\'", "add i $i 1", "add column $column 1", "jmp skip_cell", "#start", "let i 1", "#loop", "jgt $i $day_count done", "jgt $i 9 print_day", "prt \\' \\' \\'\\'", "#print_day", "prt $i \\' \\'", "add i $i 1", "add column $column 1", "jne $column 7 loop", "prt \\'\\'", "let column 0", "jmp loop", "#done", "prt \\'\\'"], "cat": [["exe", "concatenate a file to the terminal output"], "let path_str $0", "jeq $path_str $nil print_error_invalid_name", "lib \\'util.get_path_by_str\\' $path_str path", "pop $path file_name", "lib \\'util.get_real_path\\' $path path", "jeq $path $nil print_error_invalid_path", "lib \\'util.verify_path\\' $path 1 is_valid", "jeq $is_valid 0 print_error_invalid_path", "lib \\'os.read_file\\' $path $file_name file_content", "jeq $file_content $nil print_error_invalid_path", "lib \\'os.get_file_type\\' $path $file_name file_type", "", "jeq $file_type \\'raw\\' raw_file", "jeq $file_type \\'txt\\' txt_file", "jeq $file_type \\'exe\\' exe_file", "jeq $file_type \\'dir\\' print_error_directory", "typ data_type $file_content", "jeq $data_type \\'list\\' list_file", "jmp unsupported_file_type", "", "#raw_file", "prt $file_content", "jmp done", "", "#txt_file", "let i 1", "jmp list_file_content", "#list_file", "let i 0", "#list_file_content", "len $file_content file_len", "jeq $file_len 0 done", "#print_txt_loop", "jeq $i $file_len done", "get $file_content $i line", "prt $line", "add i $i 1", "jmp print_txt_loop", "jmp done", "", "#exe_file", "let i 1", "len $file_content file_len", "jeq $file_len 0 done", "#print_exe_loop", "jeq $i $file_len done", "get $file_content $i line", "/replace_char_in_str $line \\'\\\\n\\' \\'\\\\\\\\n\\'", "prt $i \\'\\'", "prt \\' |\\' \\'\\'", "prt $line", "add i $i 1", "jmp print_exe_loop", "jmp done", "", "#unsupported_file_type", "prt \\'ERR Unsupported file type\\'", "jmp done", "", "#print_error_invalid_name", "prt \\'USAGE cat file\\'", "jmp done", "", "#print_error_directory", "prt \\'ERR \\\\\\"\\' \\'\\'", "prt $file_name \\'\\'", "prt \\'\\\\\\" is a directory\\'", "jmp done", "", "#print_error_invalid_path", "prt \\'ERR File not found\\'", "#done"], "cd": [["exe", "change directory"], "let path_str $0", "jne $path_str $nil continue", "lib \\'os.get_home_path\\' home_path", "lib \\'os.set_current_path\\' $home_path", "jmp done", "#continue", "lib \\'util.get_path_by_str\\' $path_str path", "lib \\'util.get_real_path\\' $path real_path", "jeq $real_path $nil print_error_invalid_path", "lib \\'util.verify_path\\' $real_path 0 is_valid", "jeq $is_valid 0 print_error_invalid_path", "lib \\'os.set_current_path\\' $path", "jmp done", "#print_error_invalid_path", "prt \\'ERR Invalid path\\'", "#done"], "clear": [["exe", "clear the terminal screen"], "lib \\'term.get_height\\' h", "jeq $h $nil done", "sub h $h 1", "lib \\'term.set_prt_delay\\' 0", "let i 0", "#new_line_loop", "jeq $i $h clear", "prt \\'\\'", "add i $i 1", "jmp new_line_loop", "", "#clear", "", "let i 0", "#clear_loop", "jeq $i $h done", "lib \\'term.prev_line\\'", "add i $i 1", "jmp clear_loop", "", "#done", "lib \\'term.set_prt_delay\\' 1"], "cowsay": [["exe", "speaking cow"], "let msg \\'Hi!\\'", "jeq $0 $nil continue", "let msg $0", "#continue", "", "len $msg length", "add length $length 2", "", "let i 0", "prt \\' \\' \\'\\'", "#upper", "jeq $i $length upper_done", "prt \\'_\\' \\'\\'", "add i $i 1", "jmp upper", "#upper_done", "prt \\'\\'", "", "prt \\'< \\' \\'\\'", "prt $msg \\'\\'", "prt \\' >\\'", "", "let i 0", "prt \\' \\' \\'\\'", "#lower", "jeq $i $length lower_done", "prt \\'-\\' \\'\\'", "add i $i 1", "jmp lower", "#lower_done", "prt \\'\\'", "", "prt \\'        \\\\\\\\   ^__^\\'", "prt \\'         \\\\\\\\  (oo)\\\\\\\\_______\\'", "prt \\'            (__)\\\\\\\\       )\\\\\\\\/\\\\\\\\\\'", "prt \\'                ||----w |\\'", "prt \\'                ||     ||\\'"], "cp": [["exe", "copy files"], "let src_path_str $0", "let dest_path_str $1", "jeq $src_path_str $nil print_error_invalid_name", "jeq $dest_path_str $nil print_error_invalid_name", "", "lib \\'util.get_path_by_str\\' $src_path_str src_path", "let err_param $src_path_str", "jeq $src_path $nil print_error_invalid_path", "pop $src_path src_file_name", "lib \\'util.get_real_path\\' $src_path src_path", "jeq $src_path $nil print_error_invalid_path", "lib \\'os.get_file_type\\' $src_path $src_file_name src_file_type", "jeq $src_file_type \\'dir\\' print_error_src_dir", "lib \\'os.read_file\\' $src_path $src_file_name file_data", "jeq $file_data $nil print_error_src_dir", "", "lib \\'util.get_path_by_str\\' $dest_path_str dest_path", "lib \\'util.get_real_path\\' $dest_path dest_path", "let err_param $dest_path_str", "jeq $dest_path $nil print_error_invalid_path", "pop $dest_path dest_file_name", "lib \\'os.get_file_type\\' $dest_path $dest_file_name dest_file_type", "", "jne $dest_file_type \\'dir\\' copy_as_file", "/ copy to dir", "psh $dest_path $dest_file_name", "lib \\'os.write_file\\' $dest_path $src_file_name $file_data", "jmp done", "", "#copy_as_file", "lib \\'os.write_file\\' $dest_path $dest_file_name $file_data", "jmp done", "", "#print_error_src_dir", "prt \\'ERR \\' \\'\\'", "prt $src_path_str \\'\\'", "prt \\' is a directory (not copied)\\'", "jmp done", "#print_error_invalid_name", "prt \\'USAGE cp source_file target_file/directory\\'", "jmp done", "#print_error_invalid_path", "prt \\'ERR No such file/directory: \\' \\'\\'", "prt $err_param", "#done"], "date": [["exe", "display date and time"], "let days []", "psh $days \\'Sun\\' \\'Mon\\' \\'Tue\\' \\'Wed\\' \\'Thu\\' \\'Fri\\' \\'Sat\\'", "let months []", "psh $months \\'Jan\\' \\'Feb\\' \\'Mar\\' \\'Apr\\'", "psh $months \\'May\\' \\'Jun\\' \\'Jul\\' \\'Aug\\'", "psh $months \\'Sep\\' \\'Oct\\' \\'Nov\\' \\'Dec\\'", "tim _day day", "get $days $_day _day_str", "tim _month month", "get $months $_month _month_str", "tim _date date", "tim _year year", "let date_str \\'\\'", "add date_str $date_str $_day_str", "add date_str $date_str \\' \\'", "add date_str $date_str $_date", "add date_str $date_str \\' \\'", "add date_str $date_str $_month_str", "add date_str $date_str \\' \\'", "add date_str $date_str $_year", "add date_str $date_str \\' \\'", "tim _hour hour", "tim _minute minute", "tim _second second", "jgt $_hour 9 add_hour", "add date_str $date_str \\'0\\'", "#add_hour", "add date_str $date_str $_hour", "add date_str $date_str \\':\\'", "jgt $_minute 9 add_minute", "add date_str $date_str \\'0\\'", "#add_minute", "add date_str $date_str $_minute", "add date_str $date_str \\':\\'", "jgt $_second 9 add_second", "add date_str $date_str \\'0\\'", "#add_second", "add date_str $date_str $_second", "prt $date_str"], "func_test": [["exe", "test function"], "def my_func", "prt 123", "end", "", "def foo", "prt \\'foo\\'", "let _a 12", "cal bar $_a", "end", "", "def bar", "prt \\'bar\\'", "prt $0", "end", "", "cal foo"], "head": [["exe", "display first lines of a file"], "let path_str $0", "jeq $path_str $nil print_error_invalid_name", "lib \\'util.get_path_by_str\\' $path_str path", "pop $path file_name", "lib \\'util.get_real_path\\' $path path", "lib \\'util.verify_path\\' $path 1 is_valid_path", "jeq $is_valid_path 0 print_error_invalid_path", "lib \\'os.read_file\\' $path $file_name file_content", "jeq $file_content $nil print_error_invalid_path", "lib \\'os.get_file_type\\' $path $file_name file_type", "let default_len 10", "let line_count 0", "", "jeq $file_type \\'raw\\' raw_file", "jeq $file_type \\'txt\\' file_with_meta", "jeq $file_type \\'exe\\' file_with_meta", "jeq $file_type \\'dir\\' print_error_directory", "typ data_type $file_content", "jeq $data_type \\'list\\' list_file", "jmp unsupported_file_type", "", "#raw_file", "prt $file_content", "jmp done", "", "#file_with_meta", "let i 1", "jmp output", "#list_file", "let i 0", "#output", "get $file_content $i line", "jeq $line $nil done", "jeq $line_count $default_len done", "prt $line", "add i $i 1", "add line_count $line_count 1", "jmp output", "", "#unsupported_file_type", "prt \\'ERR Unsupported file type\\'", "jmp done", "", "#print_error_invalid_name", "prt \\'USAGE head file\\'", "jmp done", "", "#print_error_directory", "prt \\'ERR \\\\\\"\\' \\'\\'", "prt $file_name \\'\\'", "prt \\'\\\\\\" is a directory\\'", "jmp done", "", "#print_error_invalid_path", "prt \\'ERR File not found\\'", "#done"], "ln": [["exe", "make a link"], "let src_path_str $0", "let link_path_str $1", "jeq $src_path_str $nil print_error_invalid_name", "jeq $link_path_str $nil print_error_invalid_name", "", "let err_param $link_path_str", "lib \\'util.get_path_by_str\\' $link_path_str dest_path", "pop $dest_path link_file_name", "/ check dest path valid", "lib \\'util.get_real_path\\' $dest_path dest_path", "lib \\'util.verify_path\\' $dest_path 0 is_valid_path", "jeq $is_valid_path 0 print_error_invalid_path", "", "/ check dest not exists", "psh $dest_path $link_file_name", "lib \\'util.verify_path\\' $dest_path 1 file_exists", "jeq $file_exists 1 print_error_exists", "pop $dest_path link_file_name", "", "lib \\'util.get_path_by_str\\' $link_path_str 1 1 dest_path", "", "let link_meta []", "psh $link_meta \\'lnk\\'", "psh $link_meta $src_path_str", "let link_content []", "psh $link_content $link_meta", "lib \\'os.write_file\\' $dest_path $link_file_name $link_content", "jmp done", "", "#copy_as_file", "lib \\'os.write_file\\' $dest_path $dest_file_name $file_data", "jmp done", "", "#print_error_src_dir", "prt \\'ERR \\' \\'\\'", "prt $src_path_str \\'\\'", "prt \\' is a directory (not copied)\\'", "jmp done", "#print_error_invalid_name", "prt \\'USAGE cp source_file target_file/directory\\'", "jmp done", "#print_error_invalid_path", "prt \\'ERR No such file/directory: \\' \\'\\'", "prt $err_param", "jmp done", "#print_error_exists", "prt \\'ERR File/directory exists: \\' \\'\\'", "prt $err_param", "jmp done", "", "#done"], "login": [["exe", "login remote user"], "/ A terminal builtin program (if available)", "/  to login a remote user", "/ Relevant commands:", "/ logout: sync and logout current remote user", "/ sync: upload files in /home to remote server", "/ whoami: get the current user name", "prt \\'ERR Remote login not supported on this client\\'"], "ls": [["exe", "list directory contents"], "let type_map {}", "put $type_map \\'txt\\' \\'TXT\\'", "put $type_map \\'exe\\' \\'EXE\\'", "put $type_map \\'raw\\' \\'RAW\\'", "put $type_map \\'dir\\' \\'DIR\\'", "put $type_map \\'lnk\\' \\'LNK\\'", "put $type_map $nil \\'NIL\\'", "jeq $0 $nil use_current_path", "lib \\'util.get_path_by_str\\' $0 path", "jeq $path $nil print_error", "jmp continue_with_path", "#use_current_path", "lib \\'os.get_current_path\\' path", "#continue_with_path", "lib \\'util.get_real_path\\' $path path", "jeq $path $nil print_error", "lib \\'util.verify_path\\' $path 0 is_valid", "jeq $is_valid 0 print_error", "lib \\'os.get_file_list\\' $path lst", "", "len $lst lst_len", "/ decide number of columns", "let col 1", "lib \\'term.get_width\\' w", "jeq $w $nil term_not_supported", "let col 2", "div col_w $w $col", "add rows $lst_len 1", "div rows $rows $col", "#term_not_supported", "", "let the_list []", "let idx 0", "let col_idx 0", "", "#loop", "jeq $idx $lst_len to_print", "get $lst $idx f", "", "lib \\'os.get_file_type\\' $path $f file_type", "let file_ent \\'<\\'", "get $type_map $file_type t", "add file_ent $file_ent $t", "add file_ent $file_ent \\'> \\'", "add file_ent $file_ent $f", "", "jne $file_type \\'lnk\\' not_link", "add file_ent $file_ent \\' -> \\'", "lib \\'os.read_file\\' $path $f file_content", "get $file_content 0 file_meta", "get $file_meta 1 link_path", "add file_ent $file_ent $link_path", "#not_link", "", "get $the_list $col_idx cur_line", "jne $cur_line $nil append_line", "/ a new line", "psh $the_list $file_ent", "jmp continue", "#append_line", "len $cur_line cur_len", "sub rest_space $col_w $cur_len", "mul filler \\' \\' $rest_space", "add temp_line $cur_line $filler", "add temp_line $temp_line $file_ent", "put $the_list $col_idx $temp_line", "", "#continue", "add idx $idx 1", "add col_idx $col_idx 1", "jne $col_idx $rows loop", "let col_idx 0", "jmp loop", "", "#to_print", "pol $the_list line", "jeq $line $nil end", "prt $line", "jmp to_print", "", "#print_error", "prt \\'ERR Invalid path\\'", "jmp end", "#end"], "mkdir": [["exe", "make a directory"], "let path_str $0", "jeq $path_str $nil print_error_invalid_name", "let new_dir_name \\'\\'", "#extract_last", "pop $path_str c", "jeq $c \\'\\' continue", "jeq $c \\'/\\' continue", "add new_dir_name $c $new_dir_name", "jmp extract_last", "#continue", "psh $path_str $c", "lib \\'util.get_path_by_str\\' $path_str path", "jeq $path $nil print_error_invalid_path", "lib \\'util.get_real_path\\' $path path", "jeq $path $nil print_error_invalid_path", "lib \\'util.verify_path\\' $path 0 is_valid", "jeq $is_valid 0 print_error_invalid_path", "", "lib \\'os.read_file\\' $path $new_dir_name existing", "jne $existing $nil print_error_exists", "", "lib \\'os.make_dir\\' $path $new_dir_name", "jmp done", "", "#print_error_exists", "prt \\'ERR File/directory exists\\'", "jmp done", "#print_error_invalid_name", "prt \\'USAGE mkdir directory\\'", "jmp done", "#print_error_invalid_path", "prt \\'ERR No such file/directory\\'", "#done"], "motd": [["exe", "show welcome message"], "lib \\'os.get_os_info\\' info", "get $info 0 os_name", "get $info 1 os_ver", "get $info 2 os_build", "prt $os_name \\'\\'", "prt \\'  v\\' \\'\\'", "prt $os_ver \\' (build \\'", "prt $os_build \\')\\'", "prt \\'\\'", "prt \\'Copyright (c) 1992 RunTech, Inc.\\'", "prt \\'All rights reserved.\\'", "prt \\'\\'", "prt \\'Welcome\\'"], "mv": [["exe", "move files"], "let src_path_str $0", "let dest_path_str $1", "jeq $src_path_str $nil print_error_invalid_name", "jeq $dest_path_str $nil print_error_invalid_name", "", "lib \\'util.get_path_by_str\\' $src_path_str src_path", "let err_param $src_path_str", "jeq $src_path $nil print_error_invalid_path", "pop $src_path src_file_name", "lib \\'util.get_real_path\\' $src_path src_path", "jeq $src_path $nil print_error_invalid_path", "lib \\'os.get_file_type\\' $src_path $src_file_name src_file_type", "jeq $src_file_type \\'dir\\' print_error_src_dir", "lib \\'os.read_file\\' $src_path $src_file_name file_data", "jeq $file_data $nil print_error_src_dir", "", "lib \\'util.get_path_by_str\\' $dest_path_str dest_path", "lib \\'util.get_real_path\\' $dest_path dest_path", "let err_param $dest_path_str", "jeq $dest_path $nil print_error_invalid_path", "pop $dest_path dest_file_name", "lib \\'os.get_file_type\\' $dest_path $dest_file_name dest_file_type", "", "jne $dest_file_type \\'dir\\' copy_as_file", "/ copy to dir", "psh $dest_path $dest_file_name", "lib \\'os.write_file\\' $dest_path $src_file_name $file_data", "jmp delete_src", "", "#copy_as_file", "lib \\'os.write_file\\' $dest_path $dest_file_name $file_data", "jmp delete_src", "", "#delete_src", "psh $src_path $src_file_name", "lib \\'os.delete_path\\' $src_path", "jmp done", "", "#print_error_src_dir", "prt \\'ERR \\' \\'\\'", "prt $src_path_str \\'\\'", "prt \\' is a directory (not copied)\\'", "jmp done", "#print_error_invalid_name", "prt \\'USAGE mv source_file target_file/directory\\'", "jmp done", "#print_error_invalid_path", "prt \\'ERR No such file/directory: \\' \\'\\'", "prt $err_param", "#done"], "programs": [["exe", "show available programs"], "lib \\'util.get_path_by_str\\' \\'/programs\\' path", "lib \\'os.get_file_list\\' $path lst", "#loop", "pol $lst f", "jeq $f $nil end", "lib \\'os.get_file_type\\' $path $f ft", "jne $ft \\'exe\\' loop", "prt $f \\'\\'", "prt \\' - \\' \\'\\'", "lib \\'os.read_file\\' $path $f fc", "get $fc 0 file_meta", "get $file_meta 1 file_desc", "prt $file_desc", "jmp loop", "#end"], "pwd": [["exe", "return working directory name"], "lib \\'os.get_current_path\\' path", "let path_str \\'/\\'", "#loop", "pol $path d", "jeq $d $nil done", "add path_str $path_str $d", "add path_str $path_str \\'/\\'", "jmp loop", "#done", "prt $path_str"], "rm": [["exe", "remove a file or directory entry"], "let path_str $0", "jeq $path_str $nil print_error_invalid_name", "lib \\'util.get_path_by_str\\' $path_str path", "pop $path file", "lib \\'util.get_real_path\\' $path path", "jeq $path $nil print_error_invalid_path", "psh $path $file", "lib \\'util.verify_path\\' $path 1 is_valid", "jeq $is_valid 0 print_error_invalid_path", "lib \\'os.delete_path\\' $path", "jmp done", "#print_error_invalid_name", "prt \\'USAGE rm file/directory\\'", "jmp done", "#print_error_invalid_path", "prt \\'ERR No such file/directory\\'", "#done"], "slow_print": [["exe", "print a message character by character"], "let msg \\'Hello World!\\'", "jeq $0 $nil continue", "let msg $0", "#continue", "#loop", "pol $msg c", "jeq $c \\'\\' done", "slp 100", "prt $c \\'\\'", "jmp loop", "#done", "prt \\'\\'"], "tail": [["exe", "display the last part of a file"], "let path_str $0", "jeq $path_str $nil print_error_invalid_name", "lib \\'util.get_path_by_str\\' $path_str path", "pop $path file_name", "lib \\'util.get_real_path\\' $path path", "lib \\'util.verify_path\\' $path 1 is_valid_path", "jeq $is_valid_path 0 print_error_invalid_path", "lib \\'os.read_file\\' $path $file_name file_content", "jeq $file_content $nil print_error_invalid_path", "lib \\'os.get_file_type\\' $path $file_name file_type", "", "let default_len 10", "let line_count 0", "", "jeq $file_type \\'raw\\' raw_file", "jeq $file_type \\'txt\\' file_with_meta", "jeq $file_type \\'exe\\' file_with_meta", "jeq $file_type \\'dir\\' print_error_directory", "typ data_type $file_content", "jeq $data_type \\'list\\' list_file", "jmp unsupported_file_type", "", "#raw_file", "prt $file_content", "jmp done", "", "#file_with_meta", "let i 1", "jmp calculate_start", "", "#list_file", "let i 0", "", "#calculate_start", "len $file_content l", "", "sub j $l $default_len", "jlt $j $i set_first_line", "jmp output", "", "#set_first_line", "let j $i", "", "#output", "get $file_content $j line", "jeq $line $nil done", "prt $line", "add j $j 1", "jmp output", "", "#unsupported_file_type", "prt \\'ERR Unsupported file type\\'", "jmp done", "", "#print_error_invalid_name", "prt \\'USAGE tail file\\'", "jmp done", "", "#print_error_directory", "prt \\'ERR \\\\\\"\\' \\'\\'", "prt $file_name \\'\\'", "prt \\'\\\\\\" is a directory\\'", "jmp done", "", "#print_error_invalid_path", "prt \\'ERR File not found\\'", "#done"], "test": [["exe", "for testing"], "lib \\'term.get_width\\' w", "lib \\'term.get_height\\' h", "", "jne $w $nil continue", "prt \\'ERR your current terminal is not supported\\'", "jmp finished", "#continue", "", "prt \\'(w=\\' \\'\\'", "prt $w \\', h=\\'", "prt $h \\')\\'", "prt \\'\\'", "", "prt \\'[\\' \\'\\'", "sub width $w 1", "lib \\'term.move_cursor\\' $width 0", "prt \\']\\' \\'\\'", "", "sub width $width 1", "mul width $width -1", "lib \\'term.move_cursor\\' $width 0", "", "let p 0", "sub total $w 2", "#progress", "jeq $p $total progress_done", "prt \\'=\\' \\'\\'", "add p $p 1", "slp 20", "jmp progress", "#progress_done", "prt \\'\\'", "", "#finished", "", "/ == Test key press ==", "/ #loop", "/ let key $lastkey", "/ jeq $key $nil next", "/ prt $key", "/ #next", "/ slp 100", "/ jmp loop"], "timer": [["exe", "A countdown timer"], "let len_str $0", "jeq $len_str $nil err_invalid_param", "", "let map {}", "put $map \\'s\\' 1", "put $map \\'m\\' 60", "put $map \\'h\\' 3600", "", "pop $len_str unit", "get $map $unit unit_len", "", "int num $len_str", "mul total $unit_len $num", "", "tim now now", "div now $now 1000", "add future $now $total", "", "/ show current time", "prt \\'Timer started at \\' \\'\\'", "tim h hour", "tim m minute", "tim s second", "jgt $h 9 show_hour", "prt \\'0\\' \\'\\'", "#show_hour", "prt $h \\':\\'", "jgt $m 9 show_minute", "prt \\'0\\' \\'\\'", "#show_minute", "prt $m \\':\\'", "jgt $s 9 show_second", "prt \\'0\\' \\'\\'", "#show_second", "prt $s", "", "/ timer loop", "lib \\'term.set_prt_delay\\' 0", "prt $total", "#loop", "tim current now", "div current $current 1000", "sub left $future $current", "jlt $left 0 finished", "lib \\'term.prev_line\\'", "lib \\'term.clear_line\\'", "jlt $left 3600 skip_h", "div left_h $left 3600", "prt $left_h \\'h \\'", "#skip_h", "jlt $left 60 skip_m", "mod left_m $left 3600", "div left_m $left_m 60", "prt $left_m \\'m \\'", "#skip_m", "mod left_s $left 60", "prt $left_s \\'s \\'", "prt \\'\\'", "slp 100", "jmp loop", "", "#err_invalid_param", "prt \\'USAGE timer <duration in s/m/h>\\'", "prt \\' e.g. set a 5 minutes timer: timer 5m\\'", "jmp end", "#finished", "lib \\'term.set_prt_delay\\' 1", "prt \\'Done\\'", "#end"], "todo": [["exe", "manage a todo list"], "prt \\'\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 TODO \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\\'", "prt \\'\u2502Usage: add <t> / done <i> / exit\u2502\\'", "prt \\'\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\\'", "", "lib \\'term.set_prt_delay\\' 0", "", "lib \\'os.get_home_path\\' home_path", "", "#load_data", "lib \\'os.read_file\\' $home_path \\'_todo\\' file_data", "jne $file_data $nil file_loaded", "lib \\'os.write_file\\' $home_path \\'_todo\\' []", "jmp load_data", "#file_loaded", "let todo $file_data", "len $todo size", "", "/ initial print", "let i 0", "#print_todo", "jeq $i $size print_done", "add j $i 1", "prt $j \\'. \\'", "get $todo $i item", "prt $item", "add i $i 1", "jmp print_todo", "#print_done", "", "#main_loop", "prt \\'>\\' \\'\\'", "inp input", "", "let cmd \\'\\'", "#parse", "pol $input c", "jeq $c \\'\\' parse_done", "jeq $c \\' \\' parse_done", "psh $cmd $c", "jmp parse", "#parse_done", "", "jeq $cmd \\'exit\\' end", "", "let ri -1", "", "jne $cmd \\'add\\' not_add", "psh $todo $input", "len $todo size", "let ri 0", "#not_add", "", "jne $cmd \\'done\\' not_done", "int idx $input", "sub idx $idx 1", "put $todo $idx \\'\\'", "let new_todo []", "#update_done", "pol $todo t", "jeq $t $nil update_done_finish", "jeq $t \\'\\' update_done", "psh $new_todo $t", "jmp update_done", "#update_done_finish", "let todo $new_todo", "#not_done", "", "#rewind", "jeq $ri $size rewind_done", "lib \\'term.prev_line\\'", "lib \\'term.clear_line\\'", "add ri $ri 1", "jmp rewind", "#rewind_done", "", "len $todo size", "", "let i 0", "#reprint", "jeq $i $size reprint_done", "add j $i 1", "prt $j \\'. \\'", "get $todo $i item", "prt $item", "add i $i 1", "jmp reprint", "#reprint_done", "", "lib \\'term.clear_line\\'", "let ri -1", "jmp main_loop", "", "#end", "lib \\'term.clear_line\\'", "lib \\'os.write_file\\' $home_path \\'_todo\\' $todo", "lib \\'term.set_prt_delay\\' 1", "prt \\'Bye~\\'"], "tree": [["exe", "list contents of directories in a tree-like format"], "let stack []", "let header []", "let lvl 0", "jeq $0 $nil use_current_path", "lib \\'util.get_path_by_str\\' $0 path", "lib \\'util.get_real_path\\' $path path", "jeq $path $nil print_error_invalid_path", "lib \\'util.verify_path\\' $path 0 is_valid_path", "jeq $is_valid_path 0 print_error_invalid_path", "jmp continue_with_path", "#use_current_path", "lib \\'os.get_current_path\\' path", "lib \\'util.get_real_path\\' $path path", "#continue_with_path", "#routine", "lib \\'os.get_file_list\\' $path lst", "let cur_lst $lst", "#loop", "pol $cur_lst f", "jeq $f $nil end", "lib \\'os.get_file_type\\' $path $f ft", "len $cur_lst cur_len", "let lvl_count 0", "#print_level", "jeq $lvl_count $lvl level_done", "get $header $lvl_count lvl_seg", "prt $lvl_seg \\'\\'", "add lvl_count $lvl_count 1", "jmp print_level", "#level_done", "let header_seg \\'\u2502   \\'", "jeq $cur_len 0 print_last", "prt \\'\u251c\u2500\u2500 \\' \\'\\'", "jmp head_end", "#print_last", "prt \\'\u2514\u2500\u2500 \\' \\'\\'", "let header_seg \\'     \\'", "#head_end", "let line $f", "jne $ft \\'lnk\\' not_link", "lib \\'os.read_file\\' $path $f _f_content", "get $_f_content 0 _f_meta", "get $_f_meta 1 _linked_path", "add line $line \\' -> \\'", "add line $line $_linked_path", "#not_link", "prt $line", "jne $ft \\'dir\\' not_dir", "add lvl $lvl 1", "psh $header $header_seg", "psh $path $f", "psh $stack $f", "jmp routine", "#not_dir", "jmp loop", "#end", "len $stack stack_size", "jeq $stack_size 0 exit", "pop $stack top_f", "sub lvl $lvl 1", "pop $header _", "pop $path _", "lib \\'os.get_file_list\\' $path cur_lst", "#skip_by_stack", "pol $cur_lst cur", "jeq $cur $top_f to_jmp_loop", "jmp skip_by_stack", "#to_jmp_loop", "jmp loop", "", "#print_error_invalid_path", "prt \\'ERR Invalid path\\'", "jmp exit", "#exit"], "uname": [["exe", "print operating system name"], "lib \\'os.get_os_info\\' info", "get $info 0 os_name", "get $info 1 os_ver", "get $info 2 os_build", "prt $os_name \\'\\'", "prt \\'  v\\' \\'\\'", "prt $os_ver \\'\\'", "prt \\' (build \\' \\'\\'", "prt $os_build \\')\\'", "prt \\'\\'"], "uptime": [["exe", "show how long system has been running"], "lib \\'os.get_sys_info\\' info", "get $info \\'uptime\\' uptime", "div uptime $uptime 1000", "tim h hour", "tim m minute", "tim s second", "jgt $h 9 show_hour", "prt \\'0\\' \\'\\'", "#show_hour", "prt $h \\':\\'", "jgt $m 9 show_minute", "prt \\'0\\' \\'\\'", "#show_minute", "prt $m \\':\\'", "jgt $s 9 show_second", "prt \\'0\\' \\'\\'", "#show_second", "prt $s \\' up \\'", "div days $uptime 86400", "mod uptime $uptime 86400", "div hours $uptime 3600", "mod uptime $uptime 3600", "div minutes $uptime 60", "mod uptime $uptime 60", "jeq $days 0 show_time", "prt $days \\' day\\'", "jeq $days 1 single_day", "prt \\'s\\' \\'\\'", "#single_day", "prt \\',\\' \\' \\'", "#show_time", "jgt $hours 9 hour", "prt \\'0\\' \\'\\'", "#hour", "prt $hours \\':\\'", "jgt $minutes 9 minute", "prt \\'0\\' \\'\\'", "#minute", "prt $minutes \\':\\'", "jgt $uptime 9 second", "prt \\'0\\' \\'\\'", "#second", "prt $uptime"], "v": [["exe", "view file contents"], "lib \\'term.get_height\\' h", "lib \\'term.get_width\\' w", "jeq $h $nil err_term_not_supported", "sub h $h 1", "", "let path_str $0", "jeq $path_str $nil print_usage", "lib \\'util.get_path_by_str\\' $path_str path", "jeq $path $nil print_error_invalid_file", "pop $path file_name", "lib \\'util.get_real_path\\' $path path", "jeq $path $nil print_error_invalid_file", "lib \\'os.read_file\\' $path $file_name file_content", "jeq $file_content $nil print_error_invalid_file", "lib \\'os.get_file_type\\' $path $file_name file_type", "", "/jeq $file_type \\'raw\\' raw_file", "jeq $file_type \\'txt\\' txt_file", "jeq $file_type \\'exe\\' exe_file", "jeq $file_type \\'dir\\' print_error_directory", "typ data_type $file_content", "jeq $data_type \\'list\\' list_file", "jmp unsupported_file_type", "", "#raw_file", "prt $file_content", "jmp done", "", "#txt_file", "let start_i 1", "jmp show_content", "", "#list_file", "let start_i 0", "jmp show_content", "", "#exe_file", "let start_i 1", "jmp show_content", "", "#show_content", "", "lib \\'term.set_prt_delay\\' 0", "", "def clear", "let i 0", "#clear_loop", "jeq $i $h clear_done", "lib \\'term.clear_line\\'", "lib \\'term.prev_line\\'", "add i $i 1", "jmp clear_loop", "#clear_done", "lib \\'term.clear_line\\'", "end", "", "let top_ln 1", "let reached_end 0", "", "#loop", "let i 0", "let max_ln $h", "sub line_max $w 4", "add line_max_1 $line_max 1", "let displayed_ln 0", "", "#content_loop", "jeq $i $max_ln content_done", "lib \\'term.bg_color\\' 239", "add ln $i $top_ln", "jgt $ln 9 skip_1_indent", "prt \\' \\' \\'\\'", "#skip_1_indent", "jgt $ln 99 skip_2_indent", "prt \\' \\' \\'\\'", "#skip_2_indent", "prt $ln \\' \\'", "lib \\'term.reset\\'", "sub li $ln 1", "add li $li $start_i", "get $file_content $li line", "add i $i 1", "jne $line $nil line_with_content", "lib \\'term.clear_line\\'", "prt \\'\\'", "let reached_end 1", "jmp content_loop", "#line_with_content", "len $line line_len", "jlt $line_len $line_max_1 line_len_ok", "sub max_ln $max_ln 1", "/ === wrap line", "let cc 0", "let wrap_ln 0", "#line_loop", "jeq $cc $line_max line_done", "mul c_idx $line_max $wrap_ln", "add c_idx $c_idx $cc", "jeq $c_idx $line_len whole_line_done", "get $line $c_idx line_c", "prt $line_c \\'\\'", "add cc $cc 1", "jmp line_loop", "#line_done", "prt \\'\\'", "add displayed_ln $displayed_ln 1", "jeq $displayed_ln $h content_done", "lib \\'term.bg_color\\' 239", "prt \\'    \\' \\'\\'", "lib \\'term.reset\\'", "add wrap_ln $wrap_ln 1", "let cc 0", "jmp line_loop", "#whole_line_done", "prt \\'\\'", "add displayed_ln $displayed_ln 1", "/ ^^^ wrap done", "jmp content_loop", "", "#line_len_ok", "prt $line", "add displayed_ln $displayed_ln 1", "jmp content_loop", "", "#content_done", "", "/ Bottom bar", "lib \\'term.reverse\\'", "let bar_left $file_name", "add bar_left $bar_left \\'  \\'", "add bar_left $bar_left \\'q:quit  \u2193/\u2191:line  f/b:page \\'", "mul lli $li 100", "len $file_content total_len", "div progress $lli $total_len", "jlt $progress 101 valid_progress", "let progress 100", "#valid_progress", "add bar_right \\'\\' $progress", "add bar_right $bar_right \\'%\\'", "", "prt $bar_left \\'\\'", "", "len $bar_left left_len", "len $bar_right right_len", "sub free_len $w $left_len", "sub free_len $free_len $right_len", "mul bar_space \\' \\' $free_len", "prt $bar_space \\'\\'", "", "prt $bar_right \\'\\'", "lib \\'term.reset\\'", "", "#key_listener", "let key_pressed 0", "let key $lastkey", "jne $key 81 not_q", "/ QUIT: q", "cal clear", "jmp done", "#not_q", "", "jne $key 40 not_down", "/ DOWN", "jeq $reached_end 1 not_down", "add top_ln $top_ln 1", "let key_pressed 1", "jmp continue", "#not_down", "", "jne $key 38 not_up", "/ UP", "jeq $top_ln 1 not_up", "let reached_end 0", "sub top_ln $top_ln 1", "let key_pressed 1", "jmp continue", "#not_up", "", "jne $key 70 not_forward", "/ FORWARD: f", "jeq $reached_end 1 not_forward", "add top_ln $top_ln $h", "let key_pressed 1", "jmp continue", "#not_forward", "", "jne $key 66 not_backward", "/ BACKWARD: b", "sub top_ln $top_ln $h", "jgt $top_ln 0 valid_backward", "let top_ln 1", "#valid_backward", "let reached_end 0", "let key_pressed 1", "jmp continue", "#not_backward", "", "#continue", "", "slp 50", "", "jeq $key_pressed 0 key_listener", "cal clear", "jmp loop", "", "#print_usage", "prt \\'USAGE v file\\'", "jmp done", "", "#err_term_not_supported", "prt \\'ERR Your current terminal is not supported\\'", "jmp done", "", "#print_error_invalid_file", "prt \\'ERR No such file\\'", "jmp done", "", "#print_error_directory", "prt \\'ERR \\\\\\"\\' \\'\\'", "prt $file_name \\'\\'", "prt \\'\\\\\\" is a directory\\'", "jmp done", "", "#unsupported_file_type", "prt \\'ERR Unsupported file type\\'", "jmp done", "", "#done", "lib \\'term.set_prt_delay\\' 1"], "whoami": [["exe", "show the current username"], "lib \\'util.get_path_by_str\\' \\'/env\\' path", "lib \\'util.verify_path\\' $path 0 is_valid_path", "jeq $is_valid_path 1 valid_path", "prt \\'ERR Invalid env path\\'", "jmp done", "#valid_path", "lib \\'os.read_file\\' $path \\'user\\' username", "prt $username", "#done"]}}'
 for _d $_fs
  get $_fs $_d _content
  put $root $_d $_content
 nxt
end
cal load_extra_files
let os_build '220605.0049'

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
 let _s '\\'%'

 #parse_string_char
 pol $_line _c
 ife $_c $_q
  psh $_s $_q
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
 let _p $1     / ln-tokens map
 let _lbl $2   / label-ln map
 let _funcs $3 / func-ln map
 let _lc 0
 let _cur_func_name 'global'
 for _line $_src
  / check label
  pol $_line _c1
  ife $_c1 '#'
   put $_lbl $_line $_lc
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
   add _func_end $_cur_func_name '$$'
   put $_funcs $_func_end $_lc
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
let env {}
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
  ret []
 fin
 ife $_expr '{}'
  ret {}
 fin
 pol $_expr _c1
 ife $_c1 '$'
  ife $_expr 'lastkey'
   pol $key_press _key
   ret $_key
  els
   get $env $_expr _val
   ret $_val
  fin
 fin
 / str is parsed as %str, due to conflict with single quote
 ife $_c1 '%'
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

/ ** main eval **
def runtime
 let _src $0
 let _args $1
 let env {}
 let _stack []
 let runtime_running 1
 let key_press []
 let i 0
 ife $_args $nil
 els
  for _arg $_args
    put $env $i $_arg
    add i $i 1
  nxt
 fin
 let _p {}
 let _lbl {}
 let _funcs {}
 cal parse_src $_src $_p $_lbl $_funcs
 let _pc 0

 let sig_interrupt 0
 
 #eval
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
  put $env $_var $ret
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
 ife $_cmd 'pxl'
  get $_line 1 _name
  cal eval_param $_line 2
  let _x $ret
  cal eval_param $_line 3
  let _y $ret
  pxl $_x $_y _val
  put $env $_name $_val
 fin
 ife $_cmd 'jmp'
  get $_line 1 _lbl_name
  get $_lbl $_lbl_name _pc
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
    get $_lbl $_lbl_name _pc
    #jeq_false
  fin
  ife $_cmd 'jne'
    jeq $_v1 $_v2 jne_false
    get $_lbl $_lbl_name _pc
    #jne_false
  fin
  ife $_cmd 'jgt'
    jgt $_v1 $_v2 jgt_true
    jmp jgt_false
    #jgt_true
    get $_lbl $_lbl_name _pc
    #jgt_false
  fin
  ife $_cmd 'jlt'
    jlt $_v1 $_v2 jlt_true
    jmp jlt_false
    #jlt_true
    get $_lbl $_lbl_name _pc
    #jlt_false
  fin
 #non_cond_jump

 ife $_cmd 'inp'
  get $_line 1 _var
  inp _val
  put $env $_var $_val
 fin
 ife $_cmd 'rnd'
  get $_line 1 _name
  cal eval_param $_line 2
  let _v1 $ret
  cal eval_param $_line 3
  let _v2 $ret
  rnd _r $_v1 $_v2
  put $env $_name $_r
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
 put $env $_var $_val
 #not_type_cmd
 ife $_cmd 'tim'
  get $_line 1 _var
  get $_line 2 _time
  tim _val $_time
  put $env $_var $_val
 fin
 ife $_cmd 'len'
  cal eval_param $_line 1
  let _list $ret
  get $_line 2 _name
  len $_list _len
  put $env $_name $_len
 fin
 ife $_cmd 'pol'
  cal eval_param $_line 1
  let _list $ret
  get $_line 2 _name
  pol $_list _first
  get $_line 1 _list_name
  pol $_list_name x
  put $env $_list_name $_list
  put $env $_name $_first
 fin
 ife $_cmd 'pop'
  cal eval_param $_line 1
  let _list $ret
  get $_line 2 _name
  pop $_list _last
  get $_line 1 _list_name
  pol $_list_name x
  put $env $_list_name $_list
  put $env $_name $_last
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
  put $env $_list_name $_list
 fin
 ife $_cmd 'put'
  cal eval_param $_line 1
  let _map $ret
  cal eval_param $_line 2
  let _key $ret
  cal eval_param $_line 3
  let _val $ret
  put $_map $_key $_val
 fin
 ife $_cmd 'get'
  cal eval_param $_line 1
  let _list $ret
  cal eval_param $_line 2
  let _key $ret
  cal eval_param $_line 3
  let _var $ret
  get $_list $_key _val
  put $env $_var $_val
 fin

 / ** function commands **
 jeq $_cmd 'end' func_return
 jeq $_cmd 'ret' func_return
 jmp not_func_return
 #func_return
  pop $_stack _pc
 #not_func_return
 ife $_cmd 'def'
  / jump to end
  get $_line 1 _func_name
  add _func_end $_func_name '$$'
  get $_funcs $_func_end _pc
 fin
 ife $_cmd 'cal'
  psh $_stack $_pc
  get $_line 1 _func_name
  get $_funcs $_func_name _pc
 fin
 
 / ** special **
 ife $_cmd 'led'
  cal eval_param $_line 1
  let _led_val $ret
  jeq $_led_val 0 valid_led_value
  jeq $_led_val 1 valid_led_value
  jmp led_done
  #valid_led_value
  cal set_led 2 $_led_val
  #led_done
 fin

 / ** system library **
 ife $_cmd 'lib'
  cal eval_param $_line 1
  let _lib_name $ret
  ife $_lib_name 'os.get_home_path'
   cal get_home_path
   get $_line 2 _name
   put $env $_name $ret
  fin
  ife $_lib_name 'os.get_current_path'
   cal lib_get_path
   get $_line 2 _name
   put $env $_name $ret
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
   put $env $_name $ret
  fin
  ife $_lib_name 'os.get_file_type'
   cal eval_param $_line 2
   let _path $ret
   cal eval_param $_line 3
   let _file_name $ret
   cal lib_get_file_type $_path $_file_name
   get $_line 4 _file_type_name
   put $env $_file_type_name $ret
  fin
  ife $_lib_name 'os.read_file'
   cal eval_param $_line 2
   let _path $ret
   cal eval_param $_line 3
   let _file_name $ret
   cal lib_read_file $_path $_file_name
   get $_line 4 _file_content_name
   put $env $_file_content_name $ret
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
   put $env $_info $ret
  fin
  ife $_lib_name 'os.get_sys_info'
   get $_line 2 _info
   cal lib_get_sys_info
   put $env $_info $ret
  fin
  ife $_lib_name 'util.get_path_by_str'
   cal eval_param $_line 2
   let _path_str $ret
   cal get_path_by_str $_path_str $_relative_to
   get $_line 3 _name
   put $env $_name $ret
  fin
  ife $_lib_name 'util.verify_path'
   cal eval_param $_line 2
   let _path $ret
   cal eval_param $_line 3
   let _is_file $ret
   cal verify_path $_path $_is_file
   get $_line 4 _name
   put $env $_name $ret
  fin
  ife $_lib_name 'util.get_real_path'
   cal eval_param $_line 2
   cal get_real_path $ret
   get $_line 3 _name
   put $env $_name $ret
  fin
  ife $_lib_name 'dev.set_led'
   cal eval_param $_line 2
   let _val $ret
   cal lib_set_led $_val
  fin
  ife $_lib_name 'term.prev_line'
   cal lib_screen_prev_line
  fin
  ife $_lib_name 'term.clear_line'
   cal lib_screen_clear_line
  fin
  ife $_lib_name 'term.reverse'
   cal lib_screen_reverse
  fin
  ife $_lib_name 'term.bg_color'
   cal eval_param $_line 2
   cal lib_screen_bg_color $ret
  fin
  ife $_lib_name 'term.fg_color'
   cal eval_param $_line 2
   cal lib_screen_fg_color $ret
  fin
  ife $_lib_name 'term.reset'
   cal lib_screen_reset
  fin
  ife $_lib_name 'term.set_prt_delay'
   cal eval_param $_line 2
   cal lib_set_prt_delay $ret
  fin
  ife $_lib_name 'term.get_width'
   get $_line 2 _name
   put $env $_name $term_w
  fin
  ife $_lib_name 'term.get_height'
   get $_line 2 _name
   put $env $_name $term_h
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
 fin

 add _pc $_pc 1
 jmp eval
 
 #eval_done
 let runtime_running 0
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
   for _p $path
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
  ife $ret 'exe'
   ret 1
  fin
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
  ret $nil
 fin
end

def set_led
 let _idx $0
 let _val $1
 put $leds $_idx $_val
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
 cal get_by_path $ret
 let prog_dir $ret

 get $prog_dir $_prog _file_content
 ife $_file_content $nil
  cal print_error 'File not found'
 els
  cal check_executable $_file_content
  ife $ret 1
   let _exe []
   len $_file_content _length
   sub _length $_length 1   / skip frist meta line
   for _i $_length
    add _j $_i 1
    get $_file_content $_j _line
    psh $_exe $_line
   nxt
   cal runtime $_exe $_tokens
  els
   cal print_error 'File not executable'
  fin
 fin
end

/ ==== ECHO ====
def echo
 let _tokens $0
 pol $_tokens s
  ife $s $nil
   let s ''
  fin
  pol $_tokens p
  ife $p $nil
   prt $s
  fin
  ife $p '>'
   / write to file
   pol $_tokens f
   ife $f $nil
    cal print_error 'File name missing'
   els
    cal get_current_dir
    let curr_dir $ret
    get $curr_dir $f fd
    prt $fd
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
   pol $_tokens f
   ife $f $nil
    cal print_error 'File name missing'
    ret
   els
    cal get_current_dir
    let curr_dir $ret
    get $curr_dir $f fc
    ife $fc $nil
     put $curr_dir $f $s
    els
     typ _ft $fc
     ife $_ft 'str'
      add fc $fc '\\n'
      add fc $fc $s
      put $curr_dir $f $fc
     els
      cal print_error 'Can only write to a raw file'
      ret
     fin
    fin
   fin
  fin
end

/ ==== EDIT ====
def edit
 let $_tokens $0
 pol $_tokens file_name
 ife $file_name $nil
  cal print_error 'Invalid file name'
  ret
 fin
 cal get_current_dir
 let curr_dir $ret
 get $curr_dir $file_name fc

 / create file if not exist
 ife $fc $nil
  let file_content []
  let _file_meta []
  prt 'Create a new file?'
  prt 't:txt(default) e:exe c:<cancel>'
  inp _choice
  jeq $_choice 'c' exit_edit
  ife $_choice 'e'
   psh $_file_meta 'exe'
  els
   psh $_file_meta 'txt'
  fin
  psh $file_content $_file_meta
  put $curr_dir $file_name $file_content
  prt 'File created.'
 fin
 get $curr_dir $file_name fc

 / check file editable
 typ file_type $fc
 ife $file_type 'list'
  jmp edit_file_valid
 fin
 cal print_error 'Not an editable file'
 ret
 #edit_file_valid

 prt '== Edit v0.1'
 prt '== v:view a:append i:insert r:replace q:quit'
 prt '== File: ' ''
 prt $file_name ' '
 prt 'Type: ' ''
 cal get_list_type $fc
 prt $ret

 #edit_loop
 prt '#' ''
 inp edit_in
 cal parse_input $edit_in
 let edit_tokens $ret
 pol $edit_tokens edit_cmd

 jeq $edit_cmd 'q' exit_edit   / quit
 ife $edit_cmd 'v'             / view
  get $curr_dir $file_name fc
  let _i 0    / line number
  for _row $fc
   jeq $_i 0 edit_view_skip_meta
   cal replace_char_in_str $_row '\\n' '\\\\n'
   let _row $ret
   add _ln $_i ' |'
   add _row $_ln $_row
   prt $_row
   #edit_view_skip_meta
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
 #exit_edit
end
def main
 cal get_home_path
 let path $ret

 jeq $0 $nil repl_loop
 / continue with init program
 let in $0
 jmp continue_parse_input

 #repl_loop
 cal get_prompt_str
 prt $ret ''
 inp in
 #continue_parse_input
 cal parse_input $in
 let tokens $ret
 #exec_tokens
 pol $tokens cmd

 jeq $cmd 'exit' exit
 jeq $cmd $nil repl_loop

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
  jmp repl_loop
 fin

 / -- EDIT --
 ife $cmd 'edit'
  cal edit $tokens
  jmp edit_loop
 fin

 / -- ECHO --
 ife $cmd 'echo'
  cal echo $tokens
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

 / -- (EMPTY) --
 ife $cmd $nil
  jmp repl_loop
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
 jmp repl_loop

 #exit
 prt '>> Session ended <<'
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
 let _val $0
 cal set_led 1 $_val
end

def lib_get_os_info
 let _info []
 psh $_info $os_name
 psh $_info $os_ver
 psh $_info $os_build
 ret $_info
end

def lib_get_sys_info
 let _info {}
 tim _current now
 sub _uptime $_current $boot_time
 put $_info 'uptime' $_uptime
 ret $_info
end

def lib_screen_prev_line
 prt '\\\\033[F'
end

def lib_screen_clear_line
 prt '\\\\033[2K'
end

def lib_screen_reverse
 prt '\u001b[7m' ''
end

def lib_screen_reset
 prt '\u001b[0m' ''
end

def lib_screen_bg_color
 let seq '\u001b[48;5;'
 add seq $seq $0
 add seq $seq 'm'
 prt $seq ''
end

def lib_screen_fg_color
 let seq '\u001b[38;5;'
 add seq $seq $0
 add seq $seq 'm'
 prt $seq ''
end

def lib_screen_up_arrow
 prt '\\\\x1b[A'
end

def lib_screen_down_arrow
 prt '\\\\x1b[B'
end

def lib_screen_left_arrow
 prt '\\\\x1b[D'
end

def lib_screen_right_arrow
 prt '\\\\x1b[C'
end

def lib_set_prt_delay
 ife $0 0
  let prt_delay_disabled 1
 els
  let prt_delay_disabled 0
 fin
end
`
