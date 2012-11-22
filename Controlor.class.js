Game.addClass({
	'name': 'Controlor',
	'eventCreate': function()
	{
		var id_player=1;
		
		this.visible=false;
		for(var j=0; j<8; j++)
		{
			Controlor.pions[j]=[];
			
			for(var i=0; i<8;i++)
			{
				var pion=Game.instanceCreate(j*64,i*64,Pion);
				if((i==3 || i==4) && (j==3|| j==4))
				{
					pion.empty=false;
					pion.player=id_player++;
					
					if(id_player==3)
					{
						id_player=j===3?2:1;
					}
				}
				
				Controlor.pions[j][i]=pion;
			}
		}
	}
});

Controlor.id_player=1;
Controlor.pions=[];
Controlor.End_game=0;

Controlor.getAdjacentes=function(pion)
{
	var indexes=pion.getIndexes(),
		cases_adjacentes=[];
				
	//Left
	cases_adjacentes.push(indexes[0]>0?Controlor.pions[indexes[0]-1][indexes[1]]:null);
	//Top
	cases_adjacentes.push(indexes[1]>0?Controlor.pions[indexes[0]][indexes[1]-1]:null);
	//Right
	cases_adjacentes.push(indexes[0]<7?Controlor.pions[indexes[0]+1][indexes[1]]:null);
	//Down
	cases_adjacentes.push(indexes[1]<7?Controlor.pions[indexes[0]][indexes[1]+1]:null);
	//Top_Left
	cases_adjacentes.push(indexes[0]>0&&indexes[1]>0?Controlor.pions[indexes[0]-1][indexes[1]-1]:null);
	//Top_Right
	cases_adjacentes.push(indexes[0]<7&&indexes[1]>0?Controlor.pions[indexes[0]+1][indexes[1]-1]:null);
	//Bottom_Left
	cases_adjacentes.push(indexes[0]>0&&indexes[1]<7?Controlor.pions[indexes[0]-1][indexes[1]+1]:null);
	//Bottom_Right
	cases_adjacentes.push(indexes[0]<7&&indexes[1]<7?Controlor.pions[indexes[0]+1][indexes[1]+1]:null);	
	
	return cases_adjacentes;
};

Controlor.ia=function()
{	
	var return_pion=null,
		total_max=0,
		return_between_cases=[];
		
	
	for(var j=0; j<8; j++)
	{
		for(var i=0; i<8; i++)
		{
			var pion=Controlor.pions[i][j],				
				total_temp=0,
				temp_return_between_cases=[];
			if(pion.empty)
			{
				var cases_adjacentes=Controlor.getAdjacentes(pion);
				
				for(var k=0,l=cases_adjacentes.length;k<l;k++)
				{
					var pion_adj=cases_adjacentes[k];
					
					if(pion_adj && !pion_adj.empty && ((Controlor.id_player==2 && pion_adj.player==1) || (Controlor.id_player==1 && pion_adj.player==2)))
					{
						between_cases=pion.getPions(k);
						if(between_cases!==false)
						{
							total_temp+=between_cases.length;
							
							for(var t=0,l2=between_cases.length;t<l2;t++)
							{
								temp_return_between_cases.push(between_cases[t]);
							}							
						}
					}					
				}
				
				if(total_temp>total_max)
				{
					total_max=total_temp;
					return_pion=pion;
					return_between_cases=temp_return_between_cases;
				
				}
			}
		}
	}
	
	
if(Controlor.id_player===2){
	if(total_max!=0){
	
	return_pion.player=2;
	return_pion.empty=false;
	
	for(var i=0,l=return_between_cases.length;i<l;i++)
	{
		return_between_cases[i].player=2;
	}
	
	Controlor.updateScores();
	
	}
	else{
	Controlor.End_game++;
	alert(Controlor.End_game);
	if(Controlor.End_game==2){
	alert('Gagnee');
	}
	}

	Controlor.id_player=1;	
	document.getElementById('joueur').style.backgroundPosition='-64px 0';
	
	Controlor.ia();
}	

else if(Controlor.id_player===1){
	if(total_max==0){	
	Controlor.id_player=2;	
	document.getElementById('joueur').style.backgroundPosition='-64px 0';	
	Controlor.End_game++;
	alert(Controlor.End_game);
	if(Controlor.End_game==2){
	alert('Gagnee');
	}
	}
}
	
	
	
};

Controlor.updateScores=function()
{
	Controlor.End_game=0;
	
	
	var totalRed=0,
		totalGreen=0;
		pions=Game.getInstancesByType(Pion);
	for(var i=0,l=pions.length;i<l;i++)
	{
		if(!pions[i].empty)
		{
			if(pions[i].player==1)
			{
				totalRed++;
			}
			else
			{
				totalGreen++;
			}
		}
	}

	document.getElementById('total_red').innerHTML=totalRed;
	document.getElementById('total_green').innerHTML=totalGreen;
};